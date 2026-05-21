'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '@/redux/chatSlice';
import { communityMap } from '@/utils/chatMessageApi';

const TAB_NAMES = ['NFT', 'EQT', 'COM', 'SWG'];

export default function Slider() {
  const activeTab = useSelector((state) => state.chat.activeTab);
  const dispatch = useDispatch();

  const [dots, setDots] = useState(() => {
    const init = {};
    TAB_NAMES.forEach((tab) => {
      init[tab] = false;
    });
    return init;
  });

  const lastMaxIdsRef = useRef({});

  const getLastSeenMap = () => {
    try {
      const raw = localStorage.getItem('chat_lastSeen') || '{}';
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const setLastSeenForCommunity = (communityId, id) => {
    try {
      const map = getLastSeenMap();
      map[String(communityId)] = id;
      localStorage.setItem('chat_lastSeen', JSON.stringify(map));
    } catch {
      // ignore storage errors
    }
  };

  const communityIdForTab = (tabName) => communityMap[tabName];

  const fetchLatestId = async (communityId) => {
    try {
      const response = await fetch(`/api/trades/messages?community_id=${communityId}`);
      const json = await response.json();
      if (json.status !== 'success') return null;
      const messages = json.data || [];
      if (!messages.length) return null;
      return messages.reduce((max, message) => Math.max(max, Number(message.id || 0)), 0) || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const lastSeen = getLastSeenMap();
      for (const tabName of TAB_NAMES) {
        const communityId = communityIdForTab(tabName);
        const maxId = await fetchLatestId(communityId);
        if (!mounted) return;
        if (maxId) {
          lastMaxIdsRef.current[String(communityId)] = maxId;
          if (lastSeen[String(communityId)] == null) {
            setLastSeenForCommunity(communityId, maxId);
          }
        }
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      const lastSeen = getLastSeenMap();
      const newDots = {};

      for (const tabName of TAB_NAMES) {
        const communityId = communityIdForTab(tabName);
        const maxId = await fetchLatestId(communityId);
        if (!mounted) return;
        if (maxId) {
          lastMaxIdsRef.current[String(communityId)] = maxId;
          const seen = Number(lastSeen[String(communityId)] || 0);
          newDots[tabName] = maxId > seen;
        }
      }

      setDots((prev) => ({ ...prev, ...newDots }));
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleTabClick = (tabName) => {
    const communityId = communityIdForTab(tabName);
    setDots((prev) => ({ ...prev, [tabName]: false }));

    const currentMax = lastMaxIdsRef.current[String(communityId)] || null;
    if (currentMax) {
      setLastSeenForCommunity(communityId, currentMax);
    }

    if (tabName === activeTab) return;
    dispatch(setActiveTab(tabName));
  };

  return (
    <div className="flex-none flex w-full items-center justify-center border-y border-black bg-white px-3 py-1.5">
      <div className="flex w-full max-w-md gap-1.5 sm:gap-2">
        {TAB_NAMES.map((name) => (
          <button
            key={name}
            onClick={() => handleTabClick(name)}
            className={`relative flex-1 min-w-0 rounded-lg border px-2 py-2 text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-colors ${
              activeTab === name
                ? 'border-white bg-[#47D185] text-white shadow-md'
                : 'border-black bg-white text-[#333333] hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              {name}
              {dots[name] && <span className="h-1.5 w-1.5 rounded-full bg-[#FF0000]" />}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
