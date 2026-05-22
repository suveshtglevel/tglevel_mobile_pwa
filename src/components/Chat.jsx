'use client';

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchInitialMessages, fetchOlderMessages } from '@/redux/chatSlice';
import { categoryLabels } from '@/utils/chatMessageApi';
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

  const { activeTab, messagesData, isLoading, isLoadingMore, hasMoreOlder, error } = useSelector((state) => state.chat);
  const userType = useSelector((state) => state.user.userData.userType);
  const isTrialActive = userType === 'premium';

  const scrollContainerRef = useRef(null);
  const isFetchingOlderRef = useRef(false);
  const preserveScrollRef = useRef(false);
  const previousScrollHeightRef = useRef(0);
  const didInitialScrollRef = useRef(false);
  const [isTradersTabOpen, setIsTradersTabOpen] = useState(true);
  const totalTraders = 29795;
  const topThreshold = 50;

  useEffect(() => {
    didInitialScrollRef.current = false;
  }, [activeTab]);

  useEffect(() => {
    const promise = dispatch(fetchInitialMessages(activeTab));
    return () => {
      if (promise?.abort) promise.abort();
    };
  }, [activeTab, dispatch]);

  const requestOlderMessages = () => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore || !hasMoreOlder || isFetchingOlderRef.current) return;
    if (container.scrollTop > topThreshold) return;

    previousScrollHeightRef.current = container.scrollHeight;
    preserveScrollRef.current = true;
    isFetchingOlderRef.current = true;
    dispatch(fetchOlderMessages(activeTab)).finally(() => {
      isFetchingOlderRef.current = false;
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (container.scrollTop <= topThreshold && !isLoading) requestOlderMessages();
  };

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (preserveScrollRef.current && !isLoadingMore) {
      container.scrollTop = container.scrollHeight - previousScrollHeightRef.current;
      preserveScrollRef.current = false;
      return;
    }

    if (!didInitialScrollRef.current && !isLoading && !isLoadingMore && messagesData.length > 0) {
      container.scrollTop = container.scrollHeight;
      didInitialScrollRef.current = true;
      return;
    }
  }, [isLoading, isLoadingMore, hasMoreOlder, messagesData.length]);

  return (
    // h-app uses 100dvh with fallback; no overflow-hidden on main so address bar collapse works smoothly
    <main className="w-full h-app bg-white flex justify-center items-stretch">
      <div className="flex flex-col h-full w-full max-w-md bg-white shadow-xl relative overflow-hidden">

        <Header />
        <Slider />

        {/* Floating Traders Tab — positioned relative to Header+Slider height (53 + 48 = ~101).
            Using top-28 (112px) gives consistent spacing on all phones. */}
        <div
          className={`absolute top-28 right-0 z-40 flex items-center cursor-pointer transition-transform duration-300 ease-in-out ${
            isTradersTabOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'
          }`}
          onClick={() => setIsTradersTabOpen(!isTradersTabOpen)}
        >
          <div className="bg-linear-to-l from-white to-[#f0f9f1] border border-[#228b22]/20 border-r-0 rounded-l-full py-1.5 pl-2.5 pr-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#228b22] flex items-center justify-center shrink-0 shadow-sm">
              <Users size={14} className="text-white" />
            </div>
            <div className={`flex items-center gap-1.5 overflow-hidden transition-all duration-300 ${isTradersTabOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-[11px] sm:text-[12px] font-semibold text-gray-700 whitespace-nowrap">Total Traders:</span>
              <span className="text-[11px] sm:text-[12px] font-bold text-[#228b22] whitespace-nowrap">{totalTraders.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Messages Area — pb-navbar keeps the last message clear of the fixed Navbar (~96px + safe area) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 sm:p-4 pb-navbar flex flex-col relative bg-[url('/chatbackground.png')] bg-cover bg-center bg-no-repeat"
        >
          {isLoading && (
            <div className="flex justify-center mt-4 mb-4">
              <span className="text-[12px] text-gray-500 animate-pulse">Loading messages...</span>
            </div>
          )}

          {!isLoading && isLoadingMore && (
            <div className="flex justify-center mt-2 mb-4">
              <span className="text-[12px] text-gray-500 animate-pulse">Loading older messages...</span>
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
                  <MessageCard message={msg} showTag tag={categoryLabels[activeTab]} />
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
          <div className="fixed inset-x-0 top-1/2 z-40 flex justify-center px-4 -translate-y-1/2 pointer-events-none">
            <div className="bg-white/90 w-full max-w-[240px] p-5 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col items-center border border-white/80 pointer-events-auto backdrop-blur-md">
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
