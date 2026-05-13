"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar"


const toneOptions = ["Cash Ring", "Chime", "Bell", "Alert", "Ping"];

const initialCategories = [
  { id: 1, label: "Nifty Bank Nifty" },
  { id: 2, label: "Equity Option" },
  { id: 3, label: "Commodities" },
];

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-[#228B22]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-md transition-transform duration-200 ${
          enabled ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ToneDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-[14px] text-gray-700 bg-white"
      >
        {value}
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-36">
          {toneOptions.map((tone) => (
            <button
              key={tone}
              onClick={() => { onChange(tone); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${
                value === tone ? "text-[#228B22] font-semibold" : "text-gray-700"
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryCard({ label, settings, onChange }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
      <h2 className="text-[16px] font-bold text-black mb-3">{label}</h2>

      {/* Trade Notification */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <span className="text-[14px] text-gray-700">Trade Notification</span>
        <Toggle
          enabled={settings.tradeNotification}
          onToggle={() => onChange("tradeNotification", !settings.tradeNotification)}
        />
      </div>

      {/* Haptic Feedback */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <span className="text-[14px] text-gray-700">Haptic Feedback</span>
        <Toggle
          enabled={settings.hapticFeedback}
          onToggle={() => onChange("hapticFeedback", !settings.hapticFeedback)}
        />
      </div>

      {/* Tone */}
      <div className="flex items-center justify-between py-3">
        <span className="text-[14px] text-gray-700">Tone</span>
        <ToneDropdown
          value={settings.tone}
          onChange={(val) => onChange("tone", val)}
        />
      </div>
    </div>
  );
}

export default function NotificationSettings() {
  const router = useRouter();

  const [settings, setSettings] = useState(
    Object.fromEntries(
      initialCategories.map((cat) => [
        cat.id,
        { tradeNotification: true, hapticFeedback: true, tone: "Cash Ring" },
      ])
    )
  );

  const handleChange = (categoryId, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [key]: value },
    }));
  };

  return (
    <main className="w-full h-[100dvh] bg-[#F3F3F7] flex justify-center overflow-hidden">
      <div className="flex flex-col h-full w-full max-w-md bg-[#F3F3F7] relative">

        {/* Header */}
        <div className="flex-none flex items-center bg-white px-4 py-3 relative shadow-sm">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} strokeWidth={2.5} className="text-black" />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold text-black tracking-tight">
            Notification Setting
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 pb-24">
          {initialCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              label={cat.label}
              settings={settings[cat.id]}
              onChange={(key, value) => handleChange(cat.id, key, value)}
            />
          ))}
        </div>

      </div>
      <Navbar />
    </main>
  );
}
