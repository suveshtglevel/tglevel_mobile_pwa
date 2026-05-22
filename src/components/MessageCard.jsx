"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCheck, X } from 'lucide-react';
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
// Per Figma (Rectangle 1348): diagonal gold gradient, thin white border,
// soft drop shadow. 78×20 pill with centered "Premium" text.
function PremiumBadge() {
  return (
    <div
      className="absolute top-1.5 right-1.5 z-20 flex items-center justify-center rounded-full"
      style={{
        width: "78px",
        height: "20px",
        background:
          "linear-gradient(151.96deg, #6E5B1D -37.31%, #FFECB3 55.27%, #6E5B1D 116.92%)",
        // border: "0.1px solid #FFFFFF",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      <span className="text-[12px] font-bold tracking-wide leading-none text-black">
        Premium
      </span>
    </div>
  );
}

export default function MessageCard({ message, showTag, tag, onUpgradePress }) {
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

  return (
    <>
      <div className="mt-auto mb-4 ml-3.5 flex flex-col items-start w-[93%] sm:w-[93%] animate-in fade-in slide-in-from-left-2 duration-300">

        {/* Outer card — matches the Figma container: white fill, 12px radius, no border.
            The drop-shadow filter (not box-shadow) is applied here so the SINGLE shadow
            wraps both the card body and the tail child as one seamless shape. */}
        <div className="relative bg-white p-3 pt-4 rounded-[12px] w-full [filter:drop-shadow(0_4px_4px_rgba(0,0,0,0.25))]">

          {/* Speech-bubble tail — the bottom-left curl, traced directly from the Figma path.
              No border/stroke and no own shadow: it's pure white fill that overlaps into the
              card, and the parent's drop-shadow filter covers it so the corner is seamless. */}
          <div className="absolute bottom-0 -left-[8px] w-[20px] h-[13px] z-0">
            <svg viewBox="0 0 20 13" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.6 0.8 C7.2 1.5 6.3 2.3 5.3 3 C2.3 5.1 0.4 7.7 3.9 8.2 C5.9 8.5 9.5 9.6 11.2 10.8 C13.7 12.4 17.1 12.9 18.9 12.9 L20 12.9 L20 0 Z" fill="#ffffff" />
            </svg>
          </div>

          {/* 🔶 Premium badge — always visible on premium messages so free users
               know this is gated content, not broken content */}
          {isMessagePremium && <PremiumBadge />}

          {/* Content area — blurred when locked */}
          <div
            className={[
              "relative z-10 transition-all duration-300",
              isLocked ? "blur-[5px] opacity-70" : "",
              // Extra top padding when badge is shown so text clears it with a slight gap
              isMessagePremium ? "pt-6" : "",
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
                  className="w-full h-auto object-contain transition-transform duration-200"
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
                  #{message.id ? String(message.id).slice(-3) : '123'}
                </span>
                {showTag && (tag || message.tag) && (
                  <span className="border border-[#228b22] text-black px-1.5 py-0.5 rounded-[5px] text-[10px] font-medium tracking-tight bg-white">
                    {tag || message.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-black font-medium shrink-0 ml-auto">
                <span className="ml-0.5">{formattedTime}</span>
                <CheckCheck size={14} className="text-blue-500 stroke-[2.5px] ml-0.5" />
              </div>
            </div>
          </div>

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