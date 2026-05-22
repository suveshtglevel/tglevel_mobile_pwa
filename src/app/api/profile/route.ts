import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { unserialize } from 'php-serialize';
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

type GroupDetail = {
  community_id: number | string;
  group_id: number | string;
  days?: number | string;
  exit_date?: string;
};

function parseExitDate(raw?: string) {
  if (!raw) return null;

  const candidate = raw.trim();
  const formats = [
    'd-M-yyyy H:m:s',
    'd-M-yyyy H:m',
    'd-M-yyyy',
    'd-M-yy H:m:s',
    'd-M-yy',
    'yyyy-LL-dd HH:mm:ss',
    'yyyy-LL-dd',
  ];

  for (const format of formats) {
    const dt = DateTime.fromFormat(candidate, format, { zone: 'Asia/Kolkata' });
    if (dt.isValid) return dt;
  }

  const iso = DateTime.fromISO(candidate, { zone: 'Asia/Kolkata' });
  if (iso.isValid) return iso;

  return null;
}

function computeExpiry(groupDetails: GroupDetail[]) {
  const parsedDates = groupDetails
    .map((group) => parseExitDate(group.exit_date))
    .filter((date): date is DateTime => Boolean(date));

  if (!parsedDates.length) {
    return {
      expiry_date: null,
      expiry_date_ui: null,
      days_left: 0,
      is_active: false,
    };
  }

  const latest = parsedDates.sort((a, b) => b.toMillis() - a.toMillis())[0];
  const today = DateTime.now().setZone('Asia/Kolkata').startOf('day');
  const expiryDay = latest.setZone('Asia/Kolkata').startOf('day');

  const daysLeft = Math.max(0, Math.ceil(expiryDay.diff(today, 'days').days));

  return {
    expiry_date: latest.toISODate(),
    expiry_date_ui: latest.toFormat('dd/MM/yyyy'),
    days_left: daysLeft,
    is_active: daysLeft > 0,
  };
}

function normalizeGroupDetails(rawValue: unknown): GroupDetail[] {
  if (typeof rawValue !== 'string' || !rawValue.trim()) return [];

  try {
    const parsed = unserialize(rawValue) as unknown;
    if (Array.isArray(parsed)) return parsed as GroupDetail[];
    if (parsed && typeof parsed === 'object') {
      return Object.values(parsed as Record<string, GroupDetail>);
    }
    return [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ status: 'error', message: 'user_id required' }, { status: 400 });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM dbt_user WHERE user_id = ? LIMIT 1', [userId]);
    const user = Array.isArray(rows) && rows.length > 0 ? (rows[0] as Record<string, unknown>) : null;

    if (!user) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    const groupDetails = normalizeGroupDetails(user.group_details);
    const expiry = computeExpiry(groupDetails);

    return NextResponse.json({
      status: 'success',
      user: {
        ...user,
        group_details: groupDetails,
      },
      ...expiry,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch profile expiry', error: message },
      { status: 500 }
    );
  }
}