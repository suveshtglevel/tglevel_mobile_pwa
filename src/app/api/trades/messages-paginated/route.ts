// app/api/trades/messages-paginated/route.ts
import { proxyToProduction, getSession } from '@/lib/tglevels';

export async function GET(request: Request) {
  const session = getSession(request);
  if (!session) {
    return Response.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();
  params.set('community_id', searchParams.get('community_id') || '0');
  if (searchParams.get('after_id')) params.set('after_id', searchParams.get('after_id')!);
  if (searchParams.get('last_id')) params.set('last_id', searchParams.get('last_id')!);

  const { res } = await proxyToProduction(
    `/nifty/get_messages0?${params}`,
    { sessionCookie: session }
  );

  const data = await res.json();
  return Response.json(data);
}