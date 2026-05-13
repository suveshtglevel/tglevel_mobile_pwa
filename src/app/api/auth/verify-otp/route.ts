// export async function POST(request) {
//   const body = await request.formData();
//   const otp = body.get('otp');

//   const response = await fetch('https://app.tglevels.in/home/verifyMobileOtp', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: `otp=${otp}`,
//     redirect: 'follow',
//   });

//   if (response.ok) {
//     return Response.json({
//       status: 'success',
//       message: 'OTP verified successfully'
//     });
//   } else {
//     return Response.json({
//       status: 'error',
//       message: 'Invalid OTP'
//     }, { status: 400 });
//   }
// }




// export async function POST(request) {
//   const body = await request.formData();
//   const otp = body.get('otp');

//   // ← get cookie from request and forward it
//   const cookies = request.headers.get('cookie') || '';
//   console.log(cookies)

//   const response = await fetch('https://app.tglevels.in/home/VerifyMobileOtp', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Cookie': cookies, // ← forward session cookie
//     },
//     body: `otp=${otp}`,
//     redirect: 'follow',
//   });

//   const html = await response.text();
//   console.log("PHP RESPONSE URL:", response.url);

//   if (html.includes('sendOtp') || html.includes('Enter your mobile number') || html.includes('log-in')) {
//     return Response.json({
//       status: 'error',
//       message: 'Invalid OTP. Please try again.'
//     }, { status: 400 });
//   }

//   return Response.json({
//     status: 'success',
//     message: 'OTP verified successfully'
//   });
// }






// export async function POST(request) {
//   const body = await request.formData();
//   const otp = body.get('otp');

//   const cookies = request.headers.get('cookie') || '';
//   console.log("COOKIES RECEIVED:", cookies);

//   const response = await fetch('https://app.tglevels.in/home/verifyMobileOtp', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Cookie': cookies,
//     },
//     body: `otp=${otp}`,
//     redirect: 'follow',
//   });

//   const html = await response.text();
//   console.log("PHP RESPONSE URL:", response.url);

//   if (html.includes('sendOtp') || html.includes('Enter your mobile number') || html.includes('log-in')) {
//     return Response.json({
//       status: 'error',
//       message: 'Invalid OTP. Please try again.'
//     }, { status: 400 });
//   }

//   return Response.json({
//     status: 'success',
//     message: 'OTP verified successfully'
//   });
// }



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