// export async function POST(request) {
//   const body = await request.formData();
//   const mobile = body.get('mobile');

//   const response = await fetch('https://app.tglevels.in/home/sendOtp', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: `mobile=${mobile}`,
//     redirect: 'follow',
//   });

//   // PHP redirects on success — so if we get a response, OTP was sent
//   if (response.ok) {
//     return Response.json({ 
//       status: 'success', 
//       message: 'OTP sent successfully' 
//     });
//   } else {
//     return Response.json({ 
//       status: 'error', 
//       message: 'Failed to send OTP' 
//     }, { status: 500 });
//   }
// }



// export async function POST(request) {
//   const body = await request.formData();
//   const mobile = body.get('mobile');

//   const response = await fetch('https://app.tglevels.in/home/SendOtp', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: `mobile=${mobile}`,
//     redirect: 'follow',
//   });

//   // ← get session cookie from PHP and send to browser
//   const setCookie = response.headers.get('set-cookie');
//   console.log("SET COOKIE:", setCookie);

//   const headers = new Headers();
//   headers.set('Content-Type', 'application/json');
//   if (setCookie) {
//     headers.set('Set-Cookie', setCookie); // ← pass cookie to browser
//   }

//   return new Response(JSON.stringify({
//     status: 'success',
//     message: 'OTP sent successfully'
//   }), { headers });
// }



// export async function POST(request) {
//   const body = await request.formData();
//   const mobile = body.get('mobile');

//   const response = await fetch('https://app.tglevels.in/home/sendOtp', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: `mobile=${mobile}`,
//     redirect: 'follow',
//   });

//   const setCookie = response.headers.get('set-cookie');
//   console.log("SET COOKIE:", setCookie);

//   // ← extract ci_session value
//   const sessionMatch = setCookie?.match(/ci_session=([^;]+)/);
//   const sessionValue = sessionMatch ? sessionMatch[1] : '';

//   const headers = new Headers();
//   headers.set('Content-Type', 'application/json');
  
//   // ← set cookie with no domain restriction
//   if (sessionValue) {
//     headers.set('Set-Cookie', 
//       `ci_session=${sessionValue}; Path=/; Max-Age=31536000; SameSite=Lax`
//     );
//   }

//   return new Response(JSON.stringify({
//     status: 'success',
//     message: 'OTP sent successfully'
//   }), { headers });
// }





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

  if (res.status === 302 || res.status === 200) {
    return withSessionCookie(
      { status: 'success', message: `OTP sent to ${mobile}` },
      newSession
    );
  }

  return Response.json({ status: 'error', message: 'Failed to send OTP' }, { status: 500 });
}