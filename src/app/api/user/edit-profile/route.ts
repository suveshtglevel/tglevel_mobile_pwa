import { NextResponse } from 'next/server';

const PRODUCTION_URL = 'https://app.tglevels.in';

function getSessionCookie(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/ci_session=([^;]+)/);
  return match?.[1];
}

function extractValue(html: string, name: string): string {
  // Extract input value by name
  const inputMatch = html.match(new RegExp(`name="${name}"[^>]*value="([^"]*)"`, 'i'))
    || html.match(new RegExp(`value="([^"]*)"[^>]*name="${name}"`, 'i'));
  if (inputMatch) return inputMatch[1].trim();

  // Extract selected option for select fields
  const selectMatch = html.match(new RegExp(
    `name="${name}"[^>]*>[\\s\\S]*?<option[^>]*selected[^>]*>([^<]*)<`,
    'i'
  ));
  if (selectMatch) return selectMatch[1].trim();

  return '';
}

export async function GET(request: Request) {
  const session = getSessionCookie(request);

  if (!session) {
    return NextResponse.json(
      { status: 'error', message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const response = await fetch(`${PRODUCTION_URL}/edit-profile`, {
    method: 'GET',
    headers: {
      Cookie: `ci_session=${session}`,
    },
    redirect: 'manual',
  });

  // If redirected to login, session is invalid
  const location = response.headers.get('location') || '';
  if (response.status === 302 && location.includes('login')) {
    return NextResponse.json(
      { status: 'error', message: 'Session expired' },
      { status: 401 }
    );
  }

  const html = await response.text();

  // Extract user data from HTML form fields
  const userId   = extractValue(html, 'user_id');
  const fullName = extractValue(html, 'full_name');
  const email    = extractValue(html, 'email');
  const phone    = extractValue(html, 'phone');
  const gender   = extractValue(html, 'gender');
  const dob      = extractValue(html, 'dob');

  return NextResponse.json({
    status: 'success',
    user_id:   userId,
    name:      fullName,
    email:     email,
    phone:     phone,
    gender:    gender,
    dob:       dob,
  });
}

export async function POST(request: Request) {
  const session = getSessionCookie(request);
  if (!session) {
    return NextResponse.json(
      { status: 'error', message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const formData = await request.formData();

  const response = await fetch(`${PRODUCTION_URL}/edit-profile`, {
    method: 'POST',
    headers: {
      Cookie: `ci_session=${session}`,
    },
    body: formData,
    redirect: 'manual',
  });

  const location = response.headers.get('location') || '';

  if (response.status === 302 || response.status === 301) {
    return NextResponse.json({
      status: 'success',
      message: 'Profile updated',
      redirectTo: location || '/profile',
    });
  }

  const text = await response.text();

  return NextResponse.json({
    status: 'success',
    message: 'Profile updated',
    raw: text,
  });
}