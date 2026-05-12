"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

export default function DownloadPage() {

  const router = useRouter();
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.tglevels.user&hl=en_IN";
    const appStoreLink = "https://apps.apple.com/us/app/tg-levels-stock-market-mentor/id6754587128";
  return (
    <main className="w-full min-h-screen bg-white flex justify-center">

      {/* Mobile Container */}
      <div className="w-full max-w-sm min-h-screen flex flex-col">

        {/* Header */}
        <div className="px-5 pt-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-8 pt-10">

          {/* Logo */}
          <div className="relative w-32 h-32">
            <Image
              src="/tglogo.png"
              alt="TG Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="mt-10 text-4xl font-bold text-black text-center">
            Download Our App
          </h1>

          <p className="mt-3 text-gray-500 text-center text-lg">
            Available on Android & IOS
          </p>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 mt-8" />

          {/* Store Buttons */}
          <div className="mt-10 flex flex-col gap-6 w-full items-center">

            {/* Google Play */}
            <button 
            onClick={() => window.open(playStoreLink, "_blank", "noopener,noreferrer")}
            className="w-[250px] h-[72px] border-2 border-black rounded-2xl bg-white flex overflow-hidden items-center justify-center active:scale-95 transition-transform">

              <div className="relative w-full h-full">
                <Image
                  src="/playstore.png"
                  alt="Google Play"
                  fill
                  className="object-cover"
                />
              </div>
            </button>

            {/* App Store */}
            <button 
            onClick={() => window.open(appStoreLink, "_blank", "noopener,noreferrer")}
            className="w-[250px] h-[72px] border-2 border-black rounded-2xl bg-white flex overflow-hidden items-center justify-center active:scale-95 transition-transform">

              <div className="relative w-full h-full">
                <Image
                  src="/appstore.png"
                  alt="App Store"
                  fill
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Navbar Placeholder */}
        <Navbar />
      </div>
    </main>
  );
}
