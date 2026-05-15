import { proxyToProduction, getSession, withSessionCookie } from '../../../../lib/tglevels';

export async function POST(request: Request) {
  const { otp } = await request.json();
  const session = getSession(request);

  if (!otp) {
    return Response.json({ status: 'error', message: 'OTP required' }, { status: 400 });
  }

  const body = new URLSearchParams({ otp });
  const { res, newSession } = await proxyToProduction('/home/verifyMobileOtp', {
    method: 'POST',
    body,
    sessionCookie: session,
  });

  const location = res.headers.get('location') || '';
  console.log("REDIRECT LOCATION:", location);

  if (location.includes('login')) {
    return Response.json({ status: 'error', message: 'Invalid OTP' }, { status: 401 });
  }

  const isNewUser = location.includes('edit_profile');

  return withSessionCookie(
    { status: 'success', message: 'OTP verified', isNewUser },
    newSession || session || null
  );
}