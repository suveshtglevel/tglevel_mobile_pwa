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
    TAB_NAMES.forEach((t) => (init[t] = false));
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
      const m = getLastSeenMap();
      m[String(communityId)] = id;
      localStorage.setItem('chat_lastSeen', JSON.stringify(m));
    } catch {}
  };

  const communityIdForTab = (tabName) => communityMap[tabName];

  const fetchLatestId = async (communityId) => {
    try {
      const res = await fetch(`/api/trades/messages?community_id=${communityId}`);
      const json = await res.json();
      if (json.status !== 'success') return null;
      const arr = json.data || [];
      if (!arr.length) return null;
      const maxId = arr.reduce((max, m) => Math.max(max, Number(m.id || 0)), 0);
      return maxId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const lastSeen = getLastSeenMap();
      for (const tabName of TAB_NAMES) {
        const cid = communityIdForTab(tabName);
        const maxId = await fetchLatestId(cid);
        if (!mounted) return;
        if (maxId) {
          lastMaxIdsRef.current[String(cid)] = maxId;
          if (lastSeen[String(cid)] == null) {
            setLastSeenForCommunity(cid, maxId);
          }
        }
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      const lastSeen = getLastSeenMap();
      const newDots = { ...dots };
      for (const tabName of TAB_NAMES) {
        const cid = communityIdForTab(tabName);
        const maxId = await fetchLatestId(cid);
        if (!mounted) return;
        if (maxId) {
          lastMaxIdsRef.current[String(cid)] = maxId;
          const seen = Number(lastSeen[String(cid)] || 0);
          if (maxId > seen) {
            newDots[tabName] = true;
          }
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
    const cid = communityIdForTab(tabName);
    setDots((prev) => ({ ...prev, [tabName]: false }));
    const currentMax = lastMaxIdsRef.current[String(cid)] || null;
    if (currentMax) setLastSeenForCommunity(cid, currentMax);
    if (tabName === activeTab) return;
    dispatch(setActiveTab(tabName));
  };

  return (
    // Replaced non-standard arbitrary values (h-8.5, px-5.5, w-1.25, etc.) with valid ones.
    // Tabs now use flex-1 so they share width evenly across any phone size.
    <div className="flex-none flex items-center p-1.5 px-3 sm:px-4 border-y border-black bg-white w-full max-w-md justify-center">
      <div className="flex items-center justify-around gap-1.5 sm:gap-2 w-full">
        {TAB_NAMES.map((name) => (
          <button
            key={name}
            onClick={() => handleTabClick(name)}
            className={`relative flex-1 min-w-0 h-9 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors border
              ${activeTab === name
                ? 'bg-[#47D185] text-white border-white shadow-md'
                : 'bg-white text-[#333333] border-black hover:bg-gray-50'}`}
          >
            <span className="flex items-center justify-center gap-1">
              {name}
              {dots[name] && (
                <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
