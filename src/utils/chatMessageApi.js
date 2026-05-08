const RESEARCH_ANALYSIS_TEXT = `*✅*RESEARCH ANALYSIS✅*

*BUY NIFTY 13 APR 23650 CE*

*Entry Above =* 168
*SL =* 153
*Target 1 =* 183
*Target 2 =* 198

*Disclaimer*: Investments in the market are subject to market risk. Please read all related documents carefully before investing. Registration granted by SEBI, Enlistment as RA with Exchange and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
*Our Customer Care:-*99871 96114
*Rationale*=https://bit.ly/3PYI0J7
*Confidence Level Trade*
*🟡 Medium probability*`;

const buildDummyMessages = (category) => {
  const tag = category === 'All' ? 'NFT' : category;
  const now = Date.now();
  return [
    {
      id: 123,
      type: 'premium',
      tag,
      views: 1155,
      timestamp: new Date(now - 1000 * 60 * 60).toISOString(),
      content: { text: RESEARCH_ANALYSIS_TEXT },
    },
    {
      id: 124,
      type: 'premium',
      tag,
      views: 980,
      timestamp: new Date(now - 1000 * 60 * 30).toISOString(),
      content: { text: RESEARCH_ANALYSIS_TEXT },
    },
  ];
};

export const fetchMessagesFromApi = async (category, page = 1) => {
  if (page === 1) return { data: buildDummyMessages(category), hasMore: false };
  return { data: [], hasMore: false };
};
