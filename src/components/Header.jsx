"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUserMode } from '@/redux/userSlice';
import { useRouter } from 'next/navigation';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, unreadNotifications } = useSelector((state) => state.user);
  const { userType, daysLeft } = userData;
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

  const handleBadgeClick = () => {
    setOpen(false);
    dispatch(toggleUserMode());
  };

  const handleChevronClick = (e) => {
    e.stopPropagation();
    if (isPremium) setOpen((prev) => !prev);
  };

  return (
    // Standard responsive height (53px) and proper gap usage.
    <div className="relative flex-none flex items-center gap-2 sm:gap-3 px-3 sm:px-4 w-full max-w-md h-[53px] bg-white border-b border-gray-200 z-50">

      {/* LEFT LOGO */}
      <div className="shrink-0">
        <Image
          src="/tglogo.png"
          alt="Logo"
          width={40}
          height={40}
          className="w-9 h-9 sm:w-10 sm:h-10"
          priority
        />
      </div>

      {/* CENTER BADGE */}
      <div className="flex-1 min-w-0" ref={dropdownRef}>
        <div
          onClick={handleBadgeClick}
          role="button"
          tabIndex={0}
          className={`flex items-center justify-between h-8 px-2 rounded-xl border-2 shadow-sm bg-white cursor-pointer transition-all duration-300
            ${isPremium ? "border-[#228B22]" : "border-red-500"}`}
        >
          <span className="text-[12px] sm:text-[14px] font-semibold text-black truncate">
            {isPremium
              ? `Free trial - 03/12/2025 (${daysLeft}d)`
              : "Trial Expired"}
          </span>

          {isPremium && (
            <div
              onClick={handleChevronClick}
              className="ml-1 shrink-0 flex items-center justify-center"
            >
              {open
                ? <ChevronUp size={20} strokeWidth={2.5} color="#000" />
                : <ChevronDown size={20} strokeWidth={2.5} color="#000" />}
            </div>
          )}
        </div>

        {/* DROPDOWN */}
        {isPremium && open && (
          <div className="absolute top-14 left-3 right-3 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 z-50">
            <div className="flex flex-col gap-4 text-[14px] text-black">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Account</span>
                <span>Free Trial</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Remaining</span>
                <span>{daysLeft} days</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div
          onClick={() => router.push("/user-panel")}
          className="w-7 h-7 rounded-full overflow-hidden cursor-pointer border border-black flex items-center justify-center"
        >
          <Image
            src="/Profile.png"
            alt="Profile"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>

        <div
          onClick={() => router.push("/notifications")}
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          <Image
            src="/chatbell.png"
            alt="Notifications"
            width={40}
            height={40}
            className="object-contain w-full h-full"
          />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
          )}
        </div>
      </div>
    </div>
  );
}
