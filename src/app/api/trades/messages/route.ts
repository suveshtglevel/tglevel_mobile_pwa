
import { proxyToProduction, getSession } from '@/lib/tglevels';

export async function GET(request: Request) {
  const session = getSession(request);
  if (!session) {
    return Response.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const communityId = searchParams.get('community_id');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  if (!communityId) {
    return Response.json({ status: 'error', message: 'community_id is required' }, { status: 400 });
  }

  const { res } = await proxyToProduction(
    `/nifty/get_messages?community_id=${communityId}&page=${page}&limit=${limit}`,
    {
      method: 'GET',
      sessionCookie: session,
    }
  );

  const data = await res.json();
  return Response.json(data);
}

