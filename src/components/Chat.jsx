// 'use client';

// import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { fetchInitialMessages } from '@/redux/chatSlice';
// import { Users } from 'lucide-react';
// import MessageCard from './MessageCard';
// import WhiteCard from './WhiteCard';
// import Header from './Header';
// import Slider from './Slider';
// import Navbar from './Navbar';

// const getDateLabel = (timestamp) => {
//   const date = new Date(timestamp);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const msgDate = new Date(date);
//   msgDate.setHours(0, 0, 0, 0);

//   const diffTime = today.getTime() - msgDate.getTime();
//   const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

//   if (diffDays === 0) return 'Today';
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays > 1 && diffDays < 7) {
//     return date.toLocaleDateString('en-US', { weekday: 'long' });
//   }
//   return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// export default function Chat() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { activeTab, messagesData, isLoading, error } = useSelector((state) => state.chat);
//   const userType = useSelector((state) => state.user.userData.userType);
//   const isTrialActive = userType === 'premium';

//   const scrollContainerRef = useRef(null);
//   const [isTradersTabOpen, setIsTradersTabOpen] = useState(true);
//   const totalTraders = 29795;

//   // Fetch on tab change
//   // useEffect(() => {
//   //   const promise = dispatch(fetchInitialMessages(activeTab));
//   //   return () => { if (promise.abort) promise.abort(); };
//   // }, [activeTab, dispatch]);

// //   useEffect(() => {
// //   dispatch(fetchInitialMessages(activeTab));
// // }, [activeTab, dispatch]);

// // Poll every 30 seconds
// useEffect(() => {
//   const interval = setInterval(() => {
//     dispatch(fetchInitialMessages(activeTab));
//   }, 30000);

//   return () => clearInterval(interval); // cleanup on tab change
// }, [activeTab, dispatch]);

//   // Scroll to bottom after messages load
//   useLayoutEffect(() => {
//     if (!isLoading && scrollContainerRef.current) {
//       scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
//     }
//   }, [isLoading, messagesData.length]);

//   return (
//     <main className="w-full h-[100dvh] bg-white flex justify-center items-center overflow-hidden">
//       <div className="flex flex-col h-full w-full max-w-md bg-white shadow-xl relative overflow-hidden">

//         <Header />
//         <Slider />

//         {/* Floating Traders Tab */}
//         <div
//           className={`absolute top-32 right-0 z-50 flex items-center cursor-pointer transition-transform duration-300 ease-in-out ${
//             isTradersTabOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'
//           }`}
//           onClick={() => setIsTradersTabOpen(!isTradersTabOpen)}
//         >
//           <div className="bg-linear-to-l from-white to-[#f0f9f1] border border-[#228b22]/20 border-r-0 rounded-l-full py-2 pl-3 pr-4 flex items-center gap-2">
//             <div className="w-6 h-6 rounded-full bg-[#228b22] flex items-center justify-center shrink-0 shadow-sm">
//               <Users size={14} className="text-white" />
//             </div>
//             <div className={`flex items-center gap-1.5 overflow-hidden transition-all duration-300 ${isTradersTabOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
//               <span className="text-[12px] font-semibold text-gray-700 whitespace-nowrap">Total Traders:</span>
//               <span className="text-[12px] font-bold text-[#228b22] whitespace-nowrap">{totalTraders.toLocaleString('en-IN')}</span>
//             </div>
//           </div>
//         </div>

//         {/* Messages Area */}
//         <div
//           ref={scrollContainerRef}
//           className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col relative bg-[url('/chatbackground.png')] bg-cover bg-center bg-no-repeat"
//         >
//           {/* Loading */}
//           {isLoading && (
//             <div className="flex justify-center mt-4 mb-4">
//               <span className="text-[12px] text-gray-500 animate-pulse">Loading messages...</span>
//             </div>
//           )}

//           {/* Error */}
//           {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}

//           {/* Messages */}
//           {!isLoading && !error && messagesData.map((msg, index) => {
//             const currentLabel = getDateLabel(msg.timestamp);
//             const prevLabel = index > 0 ? getDateLabel(messagesData[index - 1].timestamp) : null;
//             const showDateBadge = currentLabel !== prevLabel;

//             return (
//               <React.Fragment key={msg.id}>
//                 {showDateBadge && (
//                   <div className="flex justify-center my-4">
//                     <span className="bg-white/70 backdrop-blur-md px-4 py-0.5 rounded-lg text-[12px] text-gray-600 font-bold shadow-sm">
//                       {currentLabel}
//                     </span>
//                   </div>
//                 )}
//                 {msg.type === 'white' ? (
//                   <WhiteCard message={msg} />
//                 ) : (
//                   <MessageCard message={msg} showTag={activeTab === 'All'} />
//                 )}
//               </React.Fragment>
//             );
//           })}

//           {/* Empty */}
//           {!isLoading && !error && messagesData.length === 0 && (
//             <div className="flex-1 flex items-center justify-center">
//               <p className="text-sm text-gray-500">No messages in this category.</p>
//             </div>
//           )}
//         </div>

//         {/* Trial Expired Overlay */}
//         {!isTrialActive && (
//           <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
//             <div className="bg-white/95 w-60 p-5 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col items-center border border-white backdrop-blur-md pointer-events-auto">
//               <div className="mb-3 drop-shadow-sm">
//                 <svg width="28" height="34" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round"/>
//                   <rect x="4" y="11" width="16" height="13" rx="3" fill="#EAB308"/>
//                   <circle cx="12" cy="16" r="1.5" fill="#A16207"/>
//                   <path d="M11.25 16H12.75V20H11.25V16Z" fill="#A16207" />
//                 </svg>
//               </div>
//               <span className="text-[15px] font-bold text-gray-900 mb-4 tracking-tight">Trial Expired</span>
//               <button
//                 onClick={() => router.push('/support-chat')}
//                 className="bg-[#218b32] hover:bg-[#1a7328] text-white text-[14px] font-semibold py-2.5 px-6 rounded-xl w-full transition-transform active:scale-95 shadow-sm"
//               >
//                 Talk to us
//               </button>
//             </div>
//           </div>
//         )}

//         <Navbar />
//       </div>
//     </main>
//   );
// }



// 'use client';

// import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { fetchInitialMessages, fetchNewMessages } from '@/redux/chatSlice';
// import { Users } from 'lucide-react';
// import MessageCard from './MessageCard';
// import WhiteCard from './WhiteCard';
// import Header from './Header';
// import Slider from './Slider';
// import Navbar from './Navbar';

// const getDateLabel = (timestamp) => {
//   const date = new Date(timestamp);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const msgDate = new Date(date);
//   msgDate.setHours(0, 0, 0, 0);

//   const diffTime = today.getTime() - msgDate.getTime();
//   const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

//   if (diffDays === 0) return 'Today';
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays > 1 && diffDays < 7) {
//     return date.toLocaleDateString('en-US', { weekday: 'long' });
//   }
//   return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// export default function Chat() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { activeTab, messagesData, isLoading, error } = useSelector((state) => state.chat);
//   const userType = useSelector((state) => state.user.userData.userType);
//   const isTrialActive = userType === 'premium';

//   const scrollContainerRef = useRef(null);
//   const lastMessageIdRef = useRef(null);
//   const [isTradersTabOpen, setIsTradersTabOpen] = useState(true);
//   const totalTraders = 29795;

//   // Track last message id for polling
//   useEffect(() => {
//     if (messagesData.length > 0) {
//       lastMessageIdRef.current = messagesData[messagesData.length - 1].id;
//     }
//   }, [messagesData]);

//   // 1. Initial fetch on tab change
//   useEffect(() => {
//     dispatch(fetchInitialMessages(activeTab));
//   }, [activeTab, dispatch]);

//   // 2. Poll every 1 second using after_id
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (lastMessageIdRef.current) {
//         dispatch(fetchNewMessages({
//           category: activeTab,
//           afterId: lastMessageIdRef.current,
//         }));
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [activeTab, dispatch]);

//   // 3. Scroll to bottom on initial load
//   useLayoutEffect(() => {
//     if (!isLoading && scrollContainerRef.current) {
//       scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
//     }
//   }, [isLoading]);

//   // 4. Auto scroll to bottom when new messages arrive (only if near bottom)
//   useEffect(() => {
//     if (scrollContainerRef.current) {
//       const el = scrollContainerRef.current;
//       const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
//       if (isNearBottom) {
//         el.scrollTop = el.scrollHeight;
//       }
//     }
//   }, [messagesData.length]);

//   return (
//     <main className="w-full h-[100dvh] bg-white flex justify-center items-center overflow-hidden">
//       <div className="flex flex-col h-full w-full max-w-md bg-white shadow-xl relative overflow-hidden">

//         <Header />
//         <Slider />

//         {/* Floating Traders Tab */}
//         <div
//           className={`absolute top-32 right-0 z-50 flex items-center cursor-pointer transition-transform duration-300 ease-in-out ${
//             isTradersTabOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'
//           }`}
//           onClick={() => setIsTradersTabOpen(!isTradersTabOpen)}
//         >
//           <div className="bg-linear-to-l from-white to-[#f0f9f1] border border-[#228b22]/20 border-r-0 rounded-l-full py-2 pl-3 pr-4 flex items-center gap-2">
//             <div className="w-6 h-6 rounded-full bg-[#228b22] flex items-center justify-center shrink-0 shadow-sm">
//               <Users size={14} className="text-white" />
//             </div>
//             <div className={`flex items-center gap-1.5 overflow-hidden transition-all duration-300 ${isTradersTabOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
//               <span className="text-[12px] font-semibold text-gray-700 whitespace-nowrap">Total Traders:</span>
//               <span className="text-[12px] font-bold text-[#228b22] whitespace-nowrap">{totalTraders.toLocaleString('en-IN')}</span>
//             </div>
//           </div>
//         </div>

//         {/* Messages Area */}
//         <div
//           ref={scrollContainerRef}
//           className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col relative bg-[url('/chatbackground.png')] bg-cover bg-center bg-no-repeat"
//         >
//           {isLoading && (
//             <div className="flex justify-center mt-4 mb-4">
//               <span className="text-[12px] text-gray-500 animate-pulse">Loading messages...</span>
//             </div>
//           )}

//           {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}

//           {!isLoading && !error && messagesData.map((msg, index) => {
//             const currentLabel = getDateLabel(msg.timestamp);
//             const prevLabel = index > 0 ? getDateLabel(messagesData[index - 1].timestamp) : null;
//             const showDateBadge = currentLabel !== prevLabel;

//             return (
//               <React.Fragment key={msg.id}>
//                 {showDateBadge && (
//                   <div className="flex justify-center my-4">
//                     <span className="bg-white/70 backdrop-blur-md px-4 py-0.5 rounded-lg text-[12px] text-gray-600 font-bold shadow-sm">
//                       {currentLabel}
//                     </span>
//                   </div>
//                 )}
//                 {msg.type === 'white' ? (
//                   <WhiteCard message={msg} />
//                 ) : (
//                   <MessageCard message={msg} showTag={activeTab === 'All'} />
//                 )}
//               </React.Fragment>
//             );
//           })}

//           {!isLoading && !error && messagesData.length === 0 && (
//             <div className="flex-1 flex items-center justify-center">
//               <p className="text-sm text-gray-500">No messages in this category.</p>
//             </div>
//           )}
//         </div>

//         {/* Trial Expired Overlay */}
//         {!isTrialActive && (
//           <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
//             <div className="bg-white/95 w-60 p-5 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col items-center border border-white backdrop-blur-md pointer-events-auto">
//               <div className="mb-3 drop-shadow-sm">
//                 <svg width="28" height="34" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round"/>
//                   <rect x="4" y="11" width="16" height="13" rx="3" fill="#EAB308"/>
//                   <circle cx="12" cy="16" r="1.5" fill="#A16207"/>
//                   <path d="M11.25 16H12.75V20H11.25V16Z" fill="#A16207" />
//                 </svg>
//               </div>
//               <span className="text-[15px] font-bold text-gray-900 mb-4 tracking-tight">Trial Expired</span>
//               <button
//                 onClick={() => router.push('/support-chat')}
//                 className="bg-[#218b32] hover:bg-[#1a7328] text-white text-[14px] font-semibold py-2.5 px-6 rounded-xl w-full transition-transform active:scale-95 shadow-sm"
//               >
//                 Talk to us
//               </button>
//             </div>
//           </div>
//         )}

//         <Navbar />
//       </div>
//     </main>
//   );
// }



'use client';

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchInitialMessages, fetchNewMessages } from '@/redux/chatSlice';
import { Users } from 'lucide-react';
import MessageCard from './MessageCard';
import WhiteCard from './WhiteCard';
import Header from './Header';
import Slider from './Slider';
import Navbar from './Navbar';

const getDateLabel = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const msgDate = new Date(date);
  msgDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - msgDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function Chat() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { activeTab, messagesData, isLoading, error } = useSelector((state) => state.chat);
  const userType = useSelector((state) => state.user.userData.userType);
  const isTrialActive = userType === 'premium';

  const scrollContainerRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const [isTradersTabOpen, setIsTradersTabOpen] = useState(true);
  const totalTraders = 29795;

  // Update lastMessageId whenever messagesData changes
  useEffect(() => {
    if (messagesData.length > 0) {
      lastMessageIdRef.current = messagesData[messagesData.length - 1].id;
    }
  }, [messagesData]);

  // 1. Initial fetch on tab change + start polling after load
  useEffect(() => {
    // Reset last id on tab change
    lastMessageIdRef.current = null;

    // Initial load
    dispatch(fetchInitialMessages(activeTab)).then((action) => {
      // After initial load, set lastMessageId from response
      const data = action?.payload?.data;
      if (data && data.length > 0) {
        lastMessageIdRef.current = data[data.length - 1].id;
      }
    });

    // Start polling every 1 second
    const interval = setInterval(() => {
      if (lastMessageIdRef.current) {
        dispatch(fetchNewMessages({
          category: activeTab,
          afterId: lastMessageIdRef.current,
        }));
      }
    }, 1000);

    return () => clearInterval(interval); // cleanup on tab change
  }, [activeTab, dispatch]);

  // 2. Scroll to bottom on initial load
  useLayoutEffect(() => {
    if (!isLoading && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [isLoading]);

  // 3. Auto scroll to bottom when new messages arrive (only if near bottom)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      if (isNearBottom) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [messagesData.length]);

  return (
    <main className="w-full h-[100dvh] bg-white flex justify-center items-center overflow-hidden">
      <div className="flex flex-col h-full w-full max-w-md bg-white shadow-xl relative overflow-hidden">

        <Header />
        <Slider />

        {/* Floating Traders Tab */}
        <div
          className={`absolute top-32 right-0 z-50 flex items-center cursor-pointer transition-transform duration-300 ease-in-out ${
            isTradersTabOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'
          }`}
          onClick={() => setIsTradersTabOpen(!isTradersTabOpen)}
        >
          <div className="bg-linear-to-l from-white to-[#f0f9f1] border border-[#228b22]/20 border-r-0 rounded-l-full py-2 pl-3 pr-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#228b22] flex items-center justify-center shrink-0 shadow-sm">
              <Users size={14} className="text-white" />
            </div>
            <div className={`flex items-center gap-1.5 overflow-hidden transition-all duration-300 ${isTradersTabOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-[12px] font-semibold text-gray-700 whitespace-nowrap">Total Traders:</span>
              <span className="text-[12px] font-bold text-[#228b22] whitespace-nowrap">{totalTraders.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col relative bg-[url('/chatbackground.png')] bg-cover bg-center bg-no-repeat"
        >
          {isLoading && (
            <div className="flex justify-center mt-4 mb-4">
              <span className="text-[12px] text-gray-500 animate-pulse">Loading messages...</span>
            </div>
          )}

          {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}

          {!isLoading && !error && messagesData.map((msg, index) => {
            const currentLabel = getDateLabel(msg.timestamp);
            const prevLabel = index > 0 ? getDateLabel(messagesData[index - 1].timestamp) : null;
            const showDateBadge = currentLabel !== prevLabel;

            return (
              <React.Fragment key={msg.id}>
                {showDateBadge && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/70 backdrop-blur-md px-4 py-0.5 rounded-lg text-[12px] text-gray-600 font-bold shadow-sm">
                      {currentLabel}
                    </span>
                  </div>
                )}
                {msg.type === 'white' ? (
                  <WhiteCard message={msg} />
                ) : (
                  <MessageCard message={msg} showTag={activeTab === 'All'} />
                )}
              </React.Fragment>
            );
          })}

          {!isLoading && !error && messagesData.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-500">No messages in this category.</p>
            </div>
          )}
        </div>

        {/* Trial Expired Overlay */}
        {!isTrialActive && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 w-60 p-5 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col items-center border border-white backdrop-blur-md pointer-events-auto">
              <div className="mb-3 drop-shadow-sm">
                <svg width="28" height="34" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round"/>
                  <rect x="4" y="11" width="16" height="13" rx="3" fill="#EAB308"/>
                  <circle cx="12" cy="16" r="1.5" fill="#A16207"/>
                  <path d="M11.25 16H12.75V20H11.25V16Z" fill="#A16207" />
                </svg>
              </div>
              <span className="text-[15px] font-bold text-gray-900 mb-4 tracking-tight">Trial Expired</span>
              <button
                onClick={() => router.push('/support-chat')}
                className="bg-[#218b32] hover:bg-[#1a7328] text-white text-[14px] font-semibold py-2.5 px-6 rounded-xl w-full transition-transform active:scale-95 shadow-sm"
              >
                Talk to us
              </button>
            </div>
          </div>
        )}

        <Navbar />
      </div>
    </main>
  );
}