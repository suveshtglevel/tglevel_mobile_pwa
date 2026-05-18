const communityMap = {
  NFT: 7,
  EQT: 9,
  COM: 11,
  SWG: 13,
};

const sortMessagesAscending = (messages) =>
  [...messages].sort((left, right) => Number(left.id) - Number(right.id));

const transformMessage = (msg) => {
  // prefer encoded_message when available and preserve the raw HTML
  const rawMessage = msg.encoded_message || msg.message || '';
  const imageMatch = rawMessage.match(/<img[^>]+src=["']([^"']+)["']/i);
  const imageUrl = imageMatch ? imageMatch[1] : null;

  let plainText = rawMessage
    ?.replace(/<img[^>]*>/gi, '')
    ?.replace(/<br\s*\/?\>/gi, '\n')
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
      rawHtml: rawMessage, // preserve original HTML for rendering
      encodedMessage: msg.encoded_message || null,
    },
  };
};

const fetchPaginatedMessagesFromApi = async (category, lastId) => {
  const communityId = communityMap[category];

  if (!communityId) return { data: [], hasMore: false };

  const params = new URLSearchParams({
    community_id: String(communityId),
  });

  if (lastId) {
    params.set('last_id', String(lastId));
  }

  const response = await fetch(`/api/trades/messages-paginated?${params.toString()}`);
  const json = await response.json();

  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch paginated messages');
  }

  const raw = json.data || [];
  const data = sortMessagesAscending(raw.map(transformMessage));

  return {
    data,
    hasMore: data.length > 0,
  };
};

export const fetchMessagesFromApi = async (category) => {
  const communityId = communityMap[category];

  if (!communityId) return { data: [], hasMore: false };

  const response = await fetch(`/api/trades/messages?community_id=${communityId}`);
  const json = await response.json();

  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch messages');
  }

  const raw = json.data || [];
  const data = sortMessagesAscending(raw.map(transformMessage));

  if (data.length > 0) {
    return {
      data,
      hasMore: false,
    };
  }

  // If the latest messages endpoint returns nothing, fall back to the
  // paginated history endpoint so the UI can still start from the most
  // recent available older message.
  return fetchPaginatedMessagesFromApi(category);
};

export const fetchOlderMessagesFromApi = async (category, lastId) => {
  if (!lastId) return { data: [], hasMore: false };

  return fetchPaginatedMessagesFromApi(category, lastId);
};