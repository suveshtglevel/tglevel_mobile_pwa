"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUserMode } from '@/redux/userSlice';
import PWAInstallButton from './PWAInstallButton';
import { useRouter } from 'next/navigation';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, unreadNotifications } = useSelector((state) => state.user);
  const { userType, avatar, gender, daysLeft } = userData;
  const isPremium = userType === "premium";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Isse dono Header (Chat + Home) premium/free me switch honge
  const handleBadgeClick = () => {
    setOpen(false); 
    dispatch(toggleUserMode()); 
  };

  const handleChevronClick = (e) => {
    e.stopPropagation(); 
    if (isPremium) setOpen((prev) => !prev);
  };

  // Dynamic Profile Image
  const profileImage = avatar || (gender === "Female" ? "/female.png" : "/human.png");

  return (
    <div className="relative flex-none flex items-center bg-white border-b border-gray-100 px-3.25 w-full max-w-md h-13.25 z-50">
      
      {/* 1. Dynamic Plan Badge */}
      <div ref={dropdownRef} className="relative">
        <div onClick={handleBadgeClick} role="button" tabIndex={0}  className={`flex items-center py-1.5 cursor-pointer transition-all duration-300 w-61.25 h-8.5 ${isPremium ? 'justify-between pl-3 pr-2 bg-white border-[1.5px] border-[#228B22] rounded-[10px] shadow-sm' : 'justify-center bg-white border-[1.5px] border-[#e11d48] rounded-[10px] shadow-sm'}`}>
          <span className={`text-[12px] sm:text-[11px] font-bold text-black tracking-tight truncate ${isPremium ? 'pr-2' : ''}`}>
            {isPremium ? `Free trial validity - 26/03/2026 (${daysLeft} days)` : `Trial Expired`}
          </span>
          {isPremium && (
            <div onClick={handleChevronClick} className="flex items-center justify-center w-4 h-4 shrink-0 hover:bg-black/10 rounded-sm transition-colors">
                 {open ? <ChevronUp size={16} strokeWidth={3} color="#000000" /> : <ChevronDown size={16} strokeWidth={3} color="#000000" />}
            </div>
          )}
        </div>

        {/* --- DETAILS DROPDOWN --- */}
        {isPremium && open && (
          <div className="absolute top-10.5 left-0 w-61.25 bg-white border border-gray-800 rounded-2xl shadow-lg p-4 animate-in fade-in slide-in-from-top-2 z-50">
            <div className="flex flex-col gap-4 text-[14px] text-black">
              <div className="flex justify-between items-center"><span className="font-bold">Account:</span><span>Free</span></div>
              <div className="flex justify-between items-center"><span className="font-bold">Remaining:</span><span>{daysLeft} days</span></div>
            </div>
          </div>
        )}
      </div>
      
      {/* 2. Right-side Icons Group */}
      <div className="flex items-center ml-auto gap-2">
        <PWAInstallButton />

        <button
          onClick={() => router.push('/support-chat')}
          className="w-8 h-8 bg-[#04386C] rounded-full flex items-center justify-center shrink-0"
        >
          <Image src="/newCustomer.png" alt="Support" width={29} height={14} />
        </button>

        {/* Profile Pic with Initials fallback if no image */}
        {/* <div className="w-[28.12px] h-[28.64px] rounded-full  border-[#228B22] bg-white flex items-center justify-center shrink-0 overflow-hidden">
           <Image 
            src="/tj.png" 
            alt="TJ Logo" 
            width={40} 
            height={40} 
            className="rounded-full object-cover" 
          />
        </div> */}

        {/* Bell Icon */}
        <div
          onClick={() => router.push('/notifications')}
          className="relative w-8 h-8 shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Image src="/chatbell.png" alt="Notifications" width={29} height={29} className="object-contain" />
          {unreadNotifications > 0 && (
             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          )}
        </div>
      </div>
    </div>
  )
}