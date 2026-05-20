import { proxyToProduction, withSessionCookie } from '../../../../lib/tglevels';

export async function POST(request: Request) {
  const { mobile } = await request.json();

  if (!mobile) {
    return Response.json({ status: 'error', message: 'Mobile number required' }, { status: 400 });
  }

  const body = new URLSearchParams({ mobile });
  const { res, newSession } = await proxyToProduction('/home/sendOtp', {
    method: 'POST',
    body,
  });

  // Treat any 2xx or 3xx (redirect) response as success — some proxies return 303
  if (res.status >= 200 && res.status < 400) {
    return withSessionCookie(
      { status: 'success', message: `OTP sent to ${mobile}` },
      newSession
    );
  }

  return Response.json({ status: 'error', message: 'Failed to send OTP' }, { status: 500 });
}