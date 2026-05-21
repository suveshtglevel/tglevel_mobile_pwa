"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Bell, Siren } from "lucide-react";

const DUMMY_NOTIFICATIONS = {
  Trades: [
    { id: 1, title: "Nifty Trades", subtitle: "NIFTY 2 MAR",  timeAgo: "2 min ago"  },
    { id: 2, title: "Nifty Trades", subtitle: "NIFTY 1 MAR",  timeAgo: "15 min ago" },
    { id: 3, title: "Nifty Trades", subtitle: "NIFTY 28 FEB", timeAgo: "1 hr ago"   },
    { id: 4, title: "Nifty Trades", subtitle: "NIFTY 27 FEB", timeAgo: "3 hr ago"   },
    { id: 5, title: "Nifty Trades", subtitle: "NIFTY 26 FEB", timeAgo: "Yesterday"  },
  ],
  Other: [],
};

export default function Notifications() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Trades");

  const list = DUMMY_NOTIFICATIONS[activeTab] || [];

  return (
    <main className="w-full h-app bg-[#e4e9f0] flex justify-center pt-safe">
      <div className="flex flex-col h-full w-full max-w-md bg-[#e4e9f0] shadow-xl relative overflow-hidden">

        {/* Top Bar */}
        <div className="flex-none flex items-center bg-[#e4e9f0] px-3 sm:px-4 py-3 relative">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft size={20} strokeWidth={2.5} className="text-black" />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-base sm:text-[18px] font-bold text-black tracking-tight">
            Notifications
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex-none px-3 sm:px-4 pt-2 pb-3">
          <div className="bg-white rounded-xl p-1 flex gap-1 shadow-sm">
            {["Trades", "Other"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 sm:py-2.5 text-[13px] sm:text-[14px] font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#228B22] text-white shadow-sm"
                    : "bg-transparent text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-6 flex flex-col gap-3 pb-safe">
          {list.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            list.map((n) => (
              <button
                key={n.id}
                className="w-full bg-white rounded-2xl px-3 sm:px-4 py-3 sm:py-4 shadow-sm flex items-center gap-3 active:scale-[0.99] transition-transform text-left"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Bell size={20} className="text-red-500" fill="currentColor" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Siren size={16} className="text-red-500 shrink-0" fill="currentColor" strokeWidth={2} />
                    <span className="text-sm sm:text-[15px] font-bold text-black tracking-tight truncate">
                      {n.title}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12px] sm:text-[13px] text-gray-600 font-medium whitespace-nowrap">
                      {n.subtitle}
                    </span>
                    <span
                      className="flex-1 h-1.5 min-w-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #4b5563 2px, transparent 2px)',
                        backgroundSize: '10px 100%',
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'left center',
                      }}
                    />
                  </div>
                  <span
                    className="block w-full h-1.5 mt-0.5"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #4b5563 2px, transparent 2px)',
                      backgroundSize: '10px 100%',
                      backgroundRepeat: 'repeat-x',
                      backgroundPosition: 'left center',
                    }}
                  />
                  <span className="text-[11px] text-gray-600 mt-1">
                    {n.timeAgo}
                  </span>
                </div>

                <ChevronRight size={22} className="text-gray-700 shrink-0" strokeWidth={2.5} />
              </button>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
