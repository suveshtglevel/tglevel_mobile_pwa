"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Users, Download } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSupportClick = () => {
    const profile = localStorage.getItem("userProfile");

    if (!profile) {
      router.push("/profile?from=crm");
      return;
    }

    try {
      const parsed = JSON.parse(profile);
      if (!parsed.fullName || !parsed.email || !parsed.phone) {
        router.push("/profile?from=crm");
        return;
      }
      router.push("/support-chat");
    } catch {
      router.push("/profile?from=crm");
    }
  };

  const navItems = [
    {
      label: "Communities",
      icon: <Users size={24} strokeWidth={2.2} />,
      path: "/chat",
    },
    {
      label: "Support",
      icon: (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="rainbow-ring" />
          <div className="w-9 h-9 rounded-full overflow-hidden z-10">
            <Image
              src="/newCustomer.png"
              alt="Support"
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      ),
      path: "/support-chat",
      onClick: handleSupportClick,
    },
    {
      label: "Download",
      icon: <Download size={24} strokeWidth={2.2} />,
      path: "/download",
    },
  ];

  return (
    // pb-safe lets navbar respect the iOS home-indicator gesture area
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="w-full max-w-md bg-[#f4f4f4] border-t border-gray-300 rounded-t-3xl px-3 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {/* justify-around + flex-1 ensures items share width evenly on any screen */}
        <div className="flex items-center justify-around py-2 sm:py-3">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={index}
                onClick={item.onClick ? item.onClick : () => router.push(item.path)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-0 px-1"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center transition-all duration-200
                    ${isActive ? "scale-110 text-black" : "text-gray-700"}`}
                >
                  {item.icon}
                </div>

                <span
                  className={`text-[12px] sm:text-sm font-medium transition-colors truncate max-w-full
                    ${isActive ? "text-black" : "text-gray-700"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
