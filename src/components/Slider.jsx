'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, fetchInitialMessages } from '@/redux/chatSlice';

const tabs = [
  { name: 'NFT', dot: true },
  { name: 'EQT' },
  { name: 'COM' },
  { name: 'SWG' },
];

export default function Slider() {
  const activeTab = useSelector((state) => state.chat.activeTab);
  const dispatch = useDispatch();

  // Auto fetch when tab changes
  useEffect(() => {
    dispatch(fetchInitialMessages(activeTab));
  }, [activeTab]);

  return (
    <div className="flex-none flex items-center p-1.5 border-y border-black bg-white w-full max-w-md justify-center">
      <div className="flex items-center justify-around gap-2 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => dispatch(setActiveTab(tab.name))}
            className={`relative h-8.5 px-5.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors border 
              ${
                activeTab === tab.name
                  ? 'bg-[#47D185] text-white border-white shadow-md'
                  : 'bg-white text-[#333333] border-black hover:bg-gray-50'
              }
            `}
          >
            <span className="flex items-center gap-1">
              {tab.name}
              {tab.dot && (
                <span className="w-1.25 h-1.25 bg-[#FF0000] rounded-full mt-1px" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}