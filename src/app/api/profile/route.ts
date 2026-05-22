import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { DateTime } from 'luxon';

export const runtime = 'nodejs';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function parseDateTime(raw: unknown) {
  if (!raw) return null;

  if (raw instanceof Date) {
    return DateTime.fromJSDate(raw, { zone: 'Asia/Kolkata' });
  }

  if (typeof raw !== 'string') return null;

  const candidate = raw.trim();
  if (!candidate) return null;

  const formats = [
    'yyyy-LL-dd HH:mm:ss',
    'yyyy-LL-dd HH:mm:ss.SSS',
    'yyyy-LL-dd',
    "yyyy-LL-dd'T'HH:mm:ss.SSS'Z'",
    "yyyy-LL-dd'T'HH:mm:ss'Z'",
  ];

  for (const format of formats) {
    const dt = DateTime.fromFormat(candidate, format, { zone: 'Asia/Kolkata' });
    if (dt.isValid) return dt;
  }

  const iso = DateTime.fromISO(candidate, { zone: 'Asia/Kolkata' });
  if (iso.isValid) return iso;

  return null;
}

function isWeekend(dateTime: DateTime) {
  return dateTime.weekday === 6 || dateTime.weekday === 7;
}

function normalizeTrialStart(createdAt: DateTime) {
  let cursor = createdAt.setZone('Asia/Kolkata').startOf('day');
  while (isWeekend(cursor)) {
    cursor = cursor.plus({ days: 1 });
  }
  return cursor;
}

function addBusinessDays(startDate: DateTime, businessDays: number) {
  let cursor = startDate.startOf('day');
  let counted = 1;

  while (counted < businessDays) {
    cursor = cursor.plus({ days: 1 });
    if (!isWeekend(cursor)) {
      counted += 1;
    }
  }

  return cursor;
}

function countBusinessDaysInclusive(from: DateTime, to: DateTime) {
  if (from > to) return 0;

  let cursor = from.startOf('day');
  const end = to.startOf('day');
  let total = 0;

  while (cursor <= end) {
    if (!isWeekend(cursor)) {
      total += 1;
    }
    cursor = cursor.plus({ days: 1 });
  }

  return total;
}

function computeTrial(createdAtRaw: unknown) {
  const createdAt = parseDateTime(createdAtRaw);

  if (!createdAt) {
    return {
      trial_start_date: null,
      trial_start_date_ui: null,
      expiry_date: null,
      expiry_date_ui: null,
      days_left: 0,
      is_active: false,
    };
  }

  const trialStart = normalizeTrialStart(createdAt);
  const expiry = addBusinessDays(trialStart, 5);
  const today = DateTime.now().setZone('Asia/Kolkata').startOf('day');
  const daysLeft = countBusinessDaysInclusive(today, expiry);

  return {
    trial_start_date: trialStart.toISODate(),
    trial_start_date_ui: trialStart.toFormat('dd/MM/yyyy'),
    expiry_date: expiry.toISODate(),
    expiry_date_ui: expiry.toFormat('dd/MM/yyyy'),
    days_left: today <= expiry ? daysLeft : 0,
    is_active: today <= expiry,
  };
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json(
      { status: 'error', message: 'user_id required' },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM dbt_user WHERE user_id = ? LIMIT 1',
      [userId]
    );

    const user =
      Array.isArray(rows) && rows.length > 0
        ? (rows[0] as Record<string, unknown>)
        : null;

    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }

    const trial = computeTrial(user.created);

    return NextResponse.json({
      status: 'success',

      user: {
        ...user,
        created: parseDateTime(user.created)?.toISO() || null,
        created_ui: parseDateTime(user.created)?.toFormat('dd/MM/yyyy') || null,
      },
      ...trial,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error';

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch user',
        error: message,
      },
      { status: 500 }
    );
  }
}