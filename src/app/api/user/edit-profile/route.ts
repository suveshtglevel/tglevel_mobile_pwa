// app/api/user/edit-profile/route.ts
import { NextResponse } from 'next/server';

const PRODUCTION_URL = 'https://app.tglevels.in';

function getSessionCookie(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/ci_session=([^;]+)/);
  return match?.[1];
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