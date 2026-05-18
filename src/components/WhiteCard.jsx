"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from 'lucide-react'; 

// --- ADVANCED SMART TEXT PARSER ---
const parseSmartText = (text) => {
  if (!text) return null;
  
  // 1. Convert *bold* text
  let processedText = text.replace(/\*([^*]+)\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  
  // 2. Highlight specific trading keywords
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
     processedText = processedText.replace(new RegExp(escapedKw, 'g'), `<strong class="font-bold text-gray-900">${kw}</strong>`);
  });

  // 3. Convert URLs to clickable links
  processedText = processedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline cursor-pointer">$1</a>');

  // 4. Convert \n to actual HTML line breaks
  processedText = processedText.replace(/\n/g, '<br />');

  // Render HTML safely
  return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
};

export default function WhiteCard({ message }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false); 

  if (!message || !message.timestamp || !message.content) return null;
  
  const dateObj = new Date(message.timestamp);
  const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Only rely on the single "text" field from backend
  const hasTextContent = Boolean(message.content.text);
  const showImage = Boolean(message.content.image && !imgError);

  return (
    <>
      <div className="mt-auto mb-4 ml-2 flex flex-col items-start w-fit max-w-[93%] animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="relative bg-white text-[#111827] p-3 rounded-[18px] rounded-bl-none border-[1.5px] border-gray-200 shadow-sm">
          
          {/* Tail */}
          <div className="absolute bottom-[-1.5px] -left-2.75 w-3.25 h-4 z-0 drop-shadow-sm">
            <svg viewBox="0 0 13 16" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 0 Q9 14 0 15.5 L13 15.5" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10 text-[14px] leading-[1.5]">
            
            {/* 1. IMAGE RENDERING */}
            {showImage && (
              <div 
                className={`cursor-pointer overflow-hidden rounded-lg border border-gray-100 relative ${hasTextContent ? 'mb-3' : ''}`} 
                onClick={() => setIsModalOpen(true)}
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

            {/* 2. SMART TEXT RENDERING (Single Field) */}
            {hasTextContent && (
              <div className="text-gray-800 space-y-2">
                  {parseSmartText(message.content.text)}
              </div>
            )}
            
            {/* 3. TIME & DATE */}
            <div className="flex items-center justify-end mt-2 pt-1 gap-1 text-[10px] text-gray-500 font-medium ml-auto">
              <span>{formattedDate}, {formattedTime}</span>
            </div>                      
          </div>

        </div>
      </div>

      {/* --- LIGHTBOX (IMAGE POPUP) --- */}
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