const PRODUCTION_URL = 'https://app.tglevels.in';

export async function proxyToProduction(
  path: string,
  options: {
    method?: string;
    body?: URLSearchParams | string;
    contentType?: string;
    sessionCookie?: string;
  } = {}
) {
  const headers: Record<string, string> = {};

  if (options.sessionCookie) {
    headers['Cookie'] = `ci_session=${options.sessionCookie}`;
  }

  if (options.contentType) {
    headers['Content-Type'] = options.contentType;
  } else if (options.body) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const res = await fetch(`${PRODUCTION_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body?.toString(),
    redirect: 'manual',
  });

  const setCookies = res.headers.getSetCookie?.() || [];
  let newSession: string | null = null;
  for (const c of setCookies) {
    const match = c.match(/ci_session=([^;]+)/);
    if (match) newSession = match[1];
  }

  return { res, newSession };
}

export function getSession(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/ci_session=([^;]+)/);
  return match?.[1] || undefined;
}

export function withSessionCookie(
  data: any,
  session: string | null,
  status: number = 200
): Response {
  const response = Response.json(data, { status });
  if (session) {
    response.headers.set(
      'Set-Cookie',
      `ci_session=${session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }
  return response;
}