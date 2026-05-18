"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Users, Download } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: "Communities",
      icon: <Users size={26} strokeWidth={2.2} />,
      path: "/chat",
    },

    {
      label: "Support",
      icon: (
        <div className="relative w-10 h-10 flex items-center justify-center">

          {/* Rainbow ring (30s cycle, 5s visible) */}
          <div className="rainbow-ring" />

          {/* Image */}
          <div className="w-9 h-9 rounded-full overflow-hidden z-10">
            <Image
              src="/newCustomer.png"
              alt="Support"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>

        </div>
      ),
      path: "/support-chat",
    },

    {
      label: "Download",
      icon: <Download size={26} strokeWidth={2.2} />,
      path: "/download",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      {/* NAV CONTAINER */}
      <div className="w-full max-w-md bg-[#f4f4f4] border-t border-gray-300 rounded-t-3xl px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

        <div className="flex items-center justify-center gap-16 py-3">

          {navItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center justify-center gap-1 min-w-[80px]"
              >
                {/* ICON WRAPPER */}
                <div
                  className={`
                    w-10 h-10 flex items-center justify-center
                    transition-all duration-200
                    ${isActive ? "scale-110 text-black" : "text-gray-700"}
                  `}
                >
                  {item.icon}
                </div>

                {/* LABEL */}
                <span
                  className={`
                    text-[15px] font-medium transition-colors
                    ${isActive ? "text-black" : "text-gray-700"}
                  `}
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