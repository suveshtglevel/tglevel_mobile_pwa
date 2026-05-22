export const communityMap = {
  NFT: 7,
  EQT: 9,
  COM: 11,
  SWG: 13,
};

// Human-readable category label per tab — shown as the pill tag on each card.
export const categoryLabels = {
  NFT: "Nifty",
  EQT: "Equity",
  COM: "Commodity",
  SWG: "Swing",
};

const sortMessagesAscending = (messages) =>
  [...messages].sort((left, right) => Number(left.id) - Number(right.id));

const transformMessage = (msg) => {
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
    // message_type "1" = trade/signal, "2" = announcement, "3" = news
    // Stored as `messageType` so MessageCard can detect premium trade messages
    messageType: msg.message_type,
    tag: msg.message_type,
    views: msg.views,
    timestamp: msg.message_time
      ? new Date(Number(msg.message_time) * 1000).toISOString()
      : new Date().toISOString(),
    content: {
      text: plainText || null,
      image: imageUrl || null,
      rawHtml: rawMessage,
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
    return { data, hasMore: false };
  }

  return fetchPaginatedMessagesFromApi(category);
};

export const fetchOlderMessagesFromApi = async (category, lastId) => {
  if (!lastId) return { data: [], hasMore: false };
  return fetchPaginatedMessagesFromApi(category, lastId);
};