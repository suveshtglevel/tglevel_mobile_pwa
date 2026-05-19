"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Camera,
  ChevronLeft,
  ChevronRight,
     ChevronDown,
  ChevronUp,
  CircleUserRound,
  FileText,
  Bell,
  Phone,
  ShieldCheck,
  Mail,
} from "lucide-react";

const menuItems = [
  { id: 1, label: "Profile", icon: CircleUserRound, route: "/profile?from=user-panel&mode=view" },
  { id: 2, label: "Terms & Condition", icon: FileText, route: "/terms-condition?mode=view" },
  { id: 3, label: "Policies", icon: ShieldCheck, route: "https://tglevels.com/terms-and-conditions/" },
  { id: 4, label: "Notification Settings", icon: Bell, route: "/notification-settings" },
  { id: 5, label: "Contact", icon: Phone, dropdown: true },
];

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full bg-white px-1 py-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform">
      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
        <Icon size={20} strokeWidth={1.9} className="text-black" />
      </div>
      <span className="flex-1 text-[15px] text-black">{label}</span>
      <ChevronRight size={22} className="text-gray-700 shrink-0" strokeWidth={2.5} />
    </button>
  );
}

const UserPanel = () => {
  const router = useRouter();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="w-full h-[100dvh] bg-white flex justify-center overflow-hidden">
      <div className="flex flex-col h-full w-full max-w-md bg-white shadow-xl relative overflow-hidden">
        {/* back button */}
        <div className="flex-none flex items-center bg-white px-4 py-3 relative">
          <button
            onClick={() => router.push("/chat")}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft size={20} strokeWidth={2.5} className="text-black" />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold text-black tracking-tight">
            Profile
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col items-center pt-5">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#228B22] bg-[#f5a0b5] flex items-center justify-center relative">
                <Image
                  src="/avatar.png"
                  alt="James Patrick"
                  fill
                  sizes="112px"
                  className="object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="relative z-10 text-white text-2xl font-semibold">JP</span>
              </div>
              <button
                type="button"
                className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-[#228B22] border-2 border-white flex items-center justify-center shadow-sm"
                aria-label="Change profile photo"
              >
                <Camera size={13} className="text-white" strokeWidth={2.5} />
              </button>
            </div>

            <h2 className="mt-4 text-[17px] font-bold text-black tracking-tight">James Patrick</h2>
            <p className="text-[13px] text-gray-400 mt-1">jamespatrick@gmail.com</p>
          </div>

          {/* Menu */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl overflow-hidden">
              {menuItems.map((item, index) => (
                <div key={item.id} className={index !== menuItems.length - 1 ? "border-b border-gray-200" : ""}>

                  {item.dropdown ? (
                    // ← Contact dropdown
                    <div>
                      <button
                        onClick={() => setContactOpen(!contactOpen)}
                        className="w-full bg-white px-1 py-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
                      >
                        <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                          <Phone size={20} strokeWidth={1.9} className="text-black" />
                        </div>
                        <span className="flex-1 text-[15px] text-black">Contact</span>
                        {contactOpen
                          ? <ChevronUp size={22} className="text-gray-700 shrink-0" strokeWidth={2.5} />
                          : <ChevronDown size={22} className="text-gray-700 shrink-0" strokeWidth={2.5} />
                        }
                      </button>

                      {/* Dropdown content */}
                      {contactOpen && (
                        <div className="mx-1 mb-3 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">

                          {/* Talk to us */}
                          <button
                            onClick={() => router.push('/support-chat')}
                            className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                          >
                            <Image
                              src="/newCustomer.png"
                              alt="Support"
                              width={44}
                              height={44}
                              className="rounded-full object-cover border border-gray-200"
                            />
                            <div className="flex-1 text-left">
                              <p className="text-[15px] font-semibold text-black">Talk To Us</p>
                              <p className="text-[12px] text-gray-400">Connect With An Agent Instantly</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[#228B22] flex items-center justify-center shrink-0">
                              <ChevronRight size={18} className="text-white" strokeWidth={2.5} />
                            </div>
                          </button>

                          {/* Phone numbers */}
                          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <Phone size={18} className="text-gray-500 shrink-0" strokeWidth={1.9} />
                            <div className="flex gap-2">
                              <a href="tel:7738756385" className="text-[14px] text-blue-500">7738756385</a>
                              <span className="text-gray-400">,</span>
                              <a href="tel:7738063455" className="text-[14px] text-blue-500">7738063455</a>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-3 px-4 py-3">
                            <Mail size={18} className="text-gray-500 shrink-0" strokeWidth={1.9} />
                            <a href="mailto:companyname@tglevels.com" className="text-[14px] text-blue-500">
                              companyname@tglevels.com
                            </a>
                          </div>

                        </div>
                      )}
                    </div>

                  ) : (
                    <MenuItem
                      icon={item.icon}
                      label={item.label}
                      onClick={() => {
                        if (!item.route) return;
                        if (item.route.startsWith('http')) {
                          window.open(item.route, '_blank');
                        } else {
                          router.push(item.route);
                        }
                      }}
                    />
                  )}

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default UserPanel;