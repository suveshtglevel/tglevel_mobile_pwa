import { proxyToProduction, getSession, withSessionCookie } from '@/lib/tglevels';

export async function POST(request: Request) {
  const session = getSession(request);
  if (!session) return Response.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });

  const { community_ids } = await request.json(); // expect array or comma string
  if (!community_ids || (Array.isArray(community_ids) && community_ids.length === 0)) {
    return Response.json({ status: 'error', message: 'community_ids required' }, { status: 400 });
  }

  // upstream may accept comma-separated ids or repeated community_id params.
  // Here we send comma-separated as form data:
  const payload = new URLSearchParams({ community_ids: Array.isArray(community_ids) ? community_ids.join(',') : String(community_ids) });

  const { res } = await proxyToProduction('/nifty/join', {
    method: 'POST',
    body: payload,
    sessionCookie: session,
  });

  const data = await res.json().catch(() => ({ status: res.status === 200 ? 'success' : 'error' }));
  return Response.json(data, { status: res.status });
}