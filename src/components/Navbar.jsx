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
      icon: <Users cursor="pointer" size={26} strokeWidth={2.2} />,
      path: "/chat",
    },
    { 
      label: "Support",
      icon: (
        <div className="w-12 h-12 cursor-pointer rounded-full overflow-hidden border-2 border-black">
          <Image
            src="/newCustomer.png"
            alt="Support"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
      ),
      path: "/support-chat",
    },
    {
      label: "Download",
      icon: <Download cursor="pointer" size={26} strokeWidth={2.2} />,
      path: "/download",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-transparent">

      {/* NAV CONTAINER */}
      <div className="w-full max-w-md bg-[#f4f4f4] border-t border-gray-300 rounded-t-3xl px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

        <div className="flex items-center justify-between">

          {navItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center justify-center gap-1 min-w-[72px] transition-all duration-200"
              >
                {/* ICON */}
                <div
                  className={`
                    flex items-center justify-center
                    transition-all duration-200
                    ${
                      isActive
                        ? "scale-105 text-black"
                        : "text-gray-600"
                    }
                  `}
                >
                  {item.icon}
                </div>

                {/* LABEL */}
                <span
                  className={`
                    text-[15px]
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? "text-black"
                        : "text-gray-700"
                    }
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