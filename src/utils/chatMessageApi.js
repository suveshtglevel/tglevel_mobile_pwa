const communityMap = {
  NFT: 7,
  EQT: 9,
  COM: 11,
  SWG: 13,
};

const transformMessage = (msg) => {
  const imageMatch = msg.message?.match(/<img[^>]+src=["']([^"']+)["']/i);
  const imageUrl = imageMatch ? imageMatch[1] : null;

  let plainText = msg.message
    ?.replace(/<img[^>]*>/gi, '')
    ?.replace(/<br\s*\/?>/gi, '\n')
    ?.replace(/<[^>]+>/g, '')
    ?.replace(/&nbsp;/g, ' ')
    ?.replace(/&amp;/g, '&')
    ?.trim();

  if (!plainText) plainText = null;

  return {
    id: msg.id,
    type: 'premium',
    tag: msg.message_type,
    views: msg.views,
    timestamp: msg.message_time
      ? new Date(Number(msg.message_time) * 1000).toISOString()
      : new Date().toISOString(),
    content: {
      text: plainText || null,
      image: imageUrl || null,
    },
  };
};

export const fetchMessagesFromApi = async (category) => {
  const communityId = communityMap[category];

  if (!communityId) return { data: [], hasMore: false };

  const response = await fetch(`/api/messages?community_id=${communityId}`);
  const json = await response.json();
  console.log(json);

  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch messages');
  }

  const raw = json.data || [];
  const data = raw.map(transformMessage);

  return { data, hasMore: false };
};