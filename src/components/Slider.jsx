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
    // initialize all dots false
    const init = {};
    TAB_NAMES.forEach((t) => (init[t] = false));
    return init;
  });

  // track the latest known message id per community (not persisted)
  const lastMaxIdsRef = useRef({});

  // lastSeen persisted to localStorage: { [communityId]: lastSeenId }
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

  // helper to map tab name -> community id
  const communityIdForTab = (tabName) => communityMap[tabName];

  // fetch latest message id for a community
  const fetchLatestId = async (communityId) => {
    try {
      const res = await fetch(`/api/trades/messages?community_id=${communityId}`);
      const json = await res.json();
      if (json.status !== 'success') return null;
      const arr = json.data || [];
      if (!arr.length) return null;
      // find max id
      const maxId = arr.reduce((max, m) => Math.max(max, Number(m.id || 0)), 0);
      return maxId || null;
    } catch {
      return null;
    }
  };

  // initialize lastSeen map and lastMaxIdsRef without showing dots
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
            // first time: set lastSeen to current max so we don't show old messages
            setLastSeenForCommunity(cid, maxId);
          }
        }
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Polling for new messages
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
      // batch update dots
      setDots((prev) => ({ ...prev, ...newDots }));
    }, 30000); // poll every 30s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleTabClick = (tabName) => {
    const cid = communityIdForTab(tabName);
    // clear dot for clicked tab and update lastSeen to current max id
    setDots((prev) => ({ ...prev, [tabName]: false }));
    const currentMax = lastMaxIdsRef.current[String(cid)] || null;
    if (currentMax) setLastSeenForCommunity(cid, currentMax);
    dispatch(setActiveTab(tabName));
  };

  return (
    <div className="flex-none flex items-center p-1.5 px-4 border-y border-black bg-white w-full max-w-md justify-center">
      <div className="flex items-center justify-around gap-2 w-full">
        {TAB_NAMES.map((name) => (
          <button
            key={name}
            onClick={() => handleTabClick(name)}
            className={`relative h-8.5 px-5.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors border 
              ${
                activeTab === name
                  ? 'bg-[#47D185] text-white border-white shadow-md'
                  : 'bg-white text-[#333333] border-black hover:bg-gray-50'
              }
            `}
          >
            <span className="flex items-center gap-1">
              {name}
              {dots[name] && (
                <span className="w-1.25 h-1.25 bg-[#FF0000] rounded-full mt-1px" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}