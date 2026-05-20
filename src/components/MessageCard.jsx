"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCheck, Eye, X, Lock, Crown, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { decodeHtmlEntities, stripEmptyPlaceholders, autoLinkHtml } from '@/lib/messageRenderer';

// --- ADVANCED SMART TEXT PARSER ---
const parseSmartText = (content) => {
  if (!content) return null;

  const source = content.encodedMessage || content.rawHtml || content.text || '';

  let decoded = decodeHtmlEntities(source);
  decoded = stripEmptyPlaceholders(decoded);
  decoded = decoded.replace(/<img[^>]*>/gi, '');

  let processedText = decoded.replace(/\*([^*]+)\*/g, '<strong class="font-bold">$1</strong>');

  const keywords = [
    "Entry Above =", "Entry Above",
    "SL =", "SL",
    "Target 1 =", "Target 2 =", "Target 3 =", "Target",
    "Disclaimer:", "Rationale=", "Rationale",
    "Confidence Level Trade", "🟡 Medium probability", "🔴 Low probability", "🟢 High probability",
    "🔓 Unlock:"
  ];

  keywords.sort((a, b) => b.length - a.length).forEach(kw => {
    const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    processedText = processedText.replace(new RegExp(escapedKw, 'g'), `<strong class="font-bold">${kw}</strong>`);
  });

  processedText = autoLinkHtml(processedText);
  processedText = processedText.replace(/\n/g, '<br />');

  return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
};

// --- PREMIUM BADGE ---
// Shown top-right on every message that requires a premium subscription.
// Uses a warm gold gradient to signal exclusivity without being loud.
function PremiumBadge() {
  return (
    <div className="absolute top-[-1px] right-[-1px] z-20 flex items-center gap-1 px-2.5 py-[5px] rounded-bl-[14px] rounded-tr-[18px] rounded-tl-none rounded-br-none"
      style={{
        background: "linear-gradient(135deg, #b8860b 0%, #f5d060 45%, #c9970a 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 4px rgba(180,130,0,0.25)",
        border: "1px solid rgba(255,255,255,0.4)",
        borderTop: "none",
        borderRight: "none",
      }}
    >
      <Crown size={10} strokeWidth={2.5} className="text-yellow-900 opacity-80 shrink-0" />
      <span
        className="text-[11px] font-semibold tracking-wide leading-none"
        style={{ color: "#3b2200", textShadow: "0 1px 0 rgba(255,255,255,0.3)" }}
      >
        Premium
      </span>
    </div>
  );
}

// --- LOCK OVERLAY ---
// Shown over blurred content for non-premium users.
// Tapping it triggers the upgrade prompt (onUpgrade callback).
function LockOverlay({ onUpgrade }) {
  return (
    <button
      onClick={onUpgrade}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-1.5 rounded-[18px] rounded-bl-none cursor-pointer"
      style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "none" }}
      aria-label="Unlock premium content"
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-full"
        style={{
          background: "linear-gradient(135deg, #b8860b 0%, #f5d060 50%, #c9970a 100%)",
          boxShadow: "0 2px 8px rgba(180,130,0,0.4)",
        }}
      >
        <Lock size={16} strokeWidth={2.5} className="text-yellow-900" />
      </div>
      <span
        className="text-[11.5px] font-semibold tracking-wide px-3 py-1 rounded-full"
        style={{
          background: "linear-gradient(135deg, #b8860b 0%, #f5d060 50%, #c9970a 100%)",
          color: "#3b2200",
          boxShadow: "0 1px 4px rgba(180,130,0,0.3)",
        }}
      >
        Unlock Premium
      </span>
    </button>
  );
}

export default function MessageCard({ message, showTag, onUpgradePress }) {
  const userType = useSelector((state) => state.user.userData.userType);
  const isPremium = userType === "premium";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!message || !message.timestamp || !message.content) return null;

  // message_type === "1" means trade/signal messages (BUY, SL, TARGET, ENTRY, etc.)
  // Types "2" (announcements) and "3" (news/analysis) are NOT premium-gated.
  // messageType "1" = trade/signal (BUY, SL, TARGET, ENTRY etc.) → show Premium badge
  // messageType "2" = announcements, "3" = news/analysis → no badge
  const isMessagePremium = message.messageType === "1";

  // A non-premium user viewing a premium message → show blur + lock
  const isLocked = isMessagePremium && !isPremium;

  const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const hasTextContent = Boolean(message.content.text || message.content.rawHtml || message.content.encodedMessage);
  const showImage = Boolean(message.content.image && !imgError);

  function handleUpgrade() {
    // Call the parent-supplied handler (e.g. open a modal, navigate to /upgrade)
    if (onUpgradePress) onUpgradePress();
  }

  return (
    <>
      <div className="mt-auto mb-4 ml-2 flex flex-col items-start w-fit max-w-[94%] animate-in fade-in slide-in-from-left-2 duration-300">

        {/* Outer card — position:relative so badge and lock overlay can anchor to it */}
        <div className="relative bg-white p-3 pt-4 rounded-[18px] rounded-bl-none border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] w-full">

          {/* SVG tail */}
          <div className="absolute bottom-[-1px] -left-2.75 w-3.25 h-4 z-0 drop-shadow-sm">
            <svg viewBox="0 0 13 16" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 0 Q9 14 0 15.5 L13 15.5" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1.5" />
            </svg>
          </div>

          {/* 🔶 Premium badge — always visible on premium messages so free users
               know this is gated content, not broken content */}
          {isMessagePremium && <PremiumBadge />}

          {/* Content area — blurred when locked */}
          <div
            className={[
              "relative z-10 transition-all duration-300",
              isLocked ? "blur-[5px] opacity-80 pointer-events-none select-none" : "",
              // Extra top padding when badge is shown so text doesn't sit under it
              isMessagePremium ? "pt-1" : "",
            ].join(" ")}
          >
            {/* 1. IMAGE */}
            {showImage && (
              <div
                className={`cursor-pointer overflow-hidden rounded-lg border border-black/5 relative ${hasTextContent ? 'mb-3' : ''}`}
                onClick={() => !isLocked && setIsModalOpen(true)}
              >
                <Image
                  src={message.content.image}
                  alt="Attached Image"
                  width={400}
                  height={300}
                  className="w-full h-auto max-h-50 object-cover transition-transform duration-200"
                  onError={() => setImgError(true)}
                />
              </div>
            )}

            {/* 2. SMART TEXT */}
            {hasTextContent && (
              <div className="text-gray-800 text-[14px] leading-[1.5] space-y-3 pr-2 whitespace-pre-wrap break-words">
                {parseSmartText(message.content)}
              </div>
            )}

            {/* 3. METADATA */}
            <div className="flex items-center justify-between mt-3 pt-1 gap-2 w-full">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[12px] text-blue-600 font-medium tracking-tight">
                  #{message.id ? String(message.id).slice(-6) : '123'}
                </span>
                {showTag && message.tag && (
                  <span className="border border-[#228b22] text-black px-1.5 py-0.5 rounded-[5px] text-[10px] font-medium tracking-tight bg-white">
                    {message.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-black font-medium shrink-0 ml-auto">
                <span className="ml-0.5">{formattedTime}</span>
                <CheckCheck size={14} className="text-blue-500 stroke-[2.5px] ml-0.5" />
              </div>
            </div>
          </div>

          {/* 🔒 Lock overlay — sits on top of blurred content, only for locked messages */}
          {isLocked && <LockOverlay onUpgrade={handleUpgrade} />}

        </div>
      </div>

      {/* LIGHTBOX */}
      {isModalOpen && showImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative w-full max-w-md flex justify-center items-center flex-col">
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors z-50 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="relative w-full flex justify-center">
              <Image
                src={message.content.image}
                alt="Enlarged view"
                width={1000}
                height={1000}
                className="rounded-xl w-full h-auto max-h-[85vh] object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}