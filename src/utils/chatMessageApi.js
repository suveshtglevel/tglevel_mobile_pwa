// const communityMap = {
//   NFT: 7,
//   EQT: 9,
//   COM: 11,
//   SWG: 13,
// };

// const CRM_LINKS = {
//   'tglevels://CustomerOffer':     'I WANT TO KNOW MORE ABOUT ₹11,999',
//   'tglevels://CustomerEnroll':    'I WANT TO ENROLL IN STUDENT GROUP',
//   'tglevels://CustomerInterest':  'I AM INTERESTED IN NIFTY LEVELS',
//   'tglevels://CustomerEOffer':    'I WANT TO KNOW ABOUT EQUITY ₹9,999',
//   'tglevels://CustomerEEnroll':   'I WANT TO ENROLL IN EQUITY GROUP',
//   'tglevels://CustomerEInterest': 'I AM INTERESTED IN EQUITY OPTION',
//   'tglevels://CustomerCInterest': 'I AM INTERESTED IN COMMODITY',
//   'tglevels://CustomerCEnroll':   'I WANT TO ENROLL IN COMMODITY GROUP',
//   'tglevels://CustomerDiscount':  'I WANT DISCOUNTED PRICE',
//   'tglevels://CustomerSupport':   'OPEN SUPPORT CHAT',
//   'tglevels://customerIOption':   'I WANT TO KNOW MORE ABOUT OPTION',
// };

// const transformMessage = (msg) => {
//   const rawMessage = msg.encoded_message || msg.message;

//   const imageMatch = rawMessage?.match(/<img[^>]+src=["']([^"']+)["']/i);
//   const imageUrl = imageMatch ? imageMatch[1] : null;

//   let htmlText = rawMessage
//     ?.replace(/<img[^>]*>/gi, '')
//     ?.replace(/<span[^>]*>﻿<\/span>/gi, '')
//     ?.trim();

//   if (htmlText) {
//     Object.entries(CRM_LINKS).forEach(([key, value]) => {
//       const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//       htmlText = htmlText.replace(new RegExp(escapedKey, 'g'), value);
//     });
//   }

//   if (!htmlText) htmlText = null;

//   return {
//     id: msg.id,
//     type: 'premium',
//     tag: msg.message_type,
//     views: msg.views,
//     timestamp: msg.message_time
//       ? new Date(Number(msg.message_time) * 1000).toISOString()
//       : new Date().toISOString(),
//     content: {
//       text: htmlText || null,
//       image: imageUrl || null,
//     },
//   };
// };

// // Initial load — gets all today's messages
// export const fetchMessagesFromApi = async (category) => {
//   const communityId = communityMap[category];
//   if (!communityId) return { data: [], hasMore: false };

//   const response = await fetch(`/api/trades/messages?community_id=${communityId}`);
//   const json = await response.json();
//   console.log(json);

//   if (json.status !== 'success') {
//     throw new Error(json.message || 'Failed to fetch messages');
//   }

//   const data = (json.data || []).map(transformMessage);
//   return { data, hasMore: false };
// };

// // ✅ Poll — gets only new messages after last id
// export const fetchNewMessagesFromApi = async (category, afterId) => {
//   const communityId = communityMap[category];
//   if (!communityId || !afterId) return { data: [] };

//   const response = await fetch(
//     `/api/trades/new-messages?community_id=${communityId}&after_id=${afterId}`
//   );
  
//   console.log(response)

//   if (json.status !== 'success') return { data: [] };

//   const data = (json.data || []).map(transformMessage);
//   return { data };
// };

const communityMap = {
  NFT: 7,
  EQT: 9,
  COM: 11,
  SWG: 13,
};

const CRM_LINKS = {
  'tglevels://CustomerOffer':     'I WANT TO KNOW MORE ABOUT ₹11,999',
  'tglevels://CustomerEnroll':    'I WANT TO ENROLL IN STUDENT GROUP',
  'tglevels://CustomerInterest':  'I AM INTERESTED IN NIFTY LEVELS',
  'tglevels://CustomerEOffer':    'I WANT TO KNOW ABOUT EQUITY ₹9,999',
  'tglevels://CustomerEEnroll':   'I WANT TO ENROLL IN EQUITY GROUP',
  'tglevels://CustomerEInterest': 'I AM INTERESTED IN EQUITY OPTION',
  'tglevels://CustomerCInterest': 'I AM INTERESTED IN COMMODITY',
  'tglevels://CustomerCEnroll':   'I WANT TO ENROLL IN COMMODITY GROUP',
  'tglevels://CustomerDiscount':  'I WANT DISCOUNTED PRICE',
  'tglevels://CustomerSupport':   'OPEN SUPPORT CHAT',
  'tglevels://customerIOption':   'I WANT TO KNOW MORE ABOUT OPTION',
};

const transformMessage = (msg) => {
  const rawMessage = msg.encoded_message || msg.message;

  const imageMatch = rawMessage?.match(/<img[^>]+src=["']([^"']+)["']/i);
  const imageUrl = imageMatch ? imageMatch[1] : null;

  let htmlText = rawMessage
    ?.replace(/<img[^>]*>/gi, '')
    ?.replace(/<span[^>]*>﻿<\/span>/gi, '')
    ?.trim();

  if (htmlText) {
    Object.entries(CRM_LINKS).forEach(([key, value]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      htmlText = htmlText.replace(new RegExp(escapedKey, 'g'), value);
    });
  }

  if (!htmlText) htmlText = null;

  return {
    id: msg.id,
    type: 'premium',
    tag: msg.message_type,
    views: msg.views,
    timestamp: msg.message_time
      ? new Date(Number(msg.message_time) * 1000).toISOString()
      : new Date().toISOString(),
    content: {
      text: htmlText || null,
      image: imageUrl || null,
    },
  };
};

// ✅ Initial load — gets all today's messages
export const fetchMessagesFromApi = async (category) => {
  const communityId = communityMap[category];
  if (!communityId) return { data: [], hasMore: false };

  const response = await fetch(
    `/api/trades/messages?community_id=${communityId}`,
    { credentials: 'include' } // ✅ sends ci_session cookie
  );

  const json = await response.json();
  console.log(json);

  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch messages');
  }

  const data = (json.data || []).map(transformMessage);
  return { data, hasMore: false };
};

// ✅ Poll — gets only new messages after last id
export const fetchNewMessagesFromApi = async (category, afterId) => {
  const communityId = communityMap[category];
  if (!communityId || !afterId) return { data: [] };

  const response = await fetch(
    `/api/trades/new-messages?community_id=${communityId}&after_id=${afterId}`,
    { credentials: 'include' } // ✅ sends ci_session cookie
  );

  const json = await response.json(); // ✅ was missing — json was undefined before
  console.log(json);

  if (json.status !== 'success') return { data: [] };

  const data = (json.data || []).map(transformMessage);
  return { data };
};