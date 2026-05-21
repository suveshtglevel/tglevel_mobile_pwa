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
    <main className="w-full min-h-app bg-white flex justify-center">
      {/* Mobile Container — pb-navbar so content never sits under the fixed Navbar */}
      <div className="w-full max-w-md min-h-app flex flex-col pb-navbar">

        {/* Header */}
        <div className="px-4 sm:px-5 pt-4 pt-safe">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-xl shadow-sm flex items-center justify-center active:scale-95 transition-transform "
            aria-label="Back"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Content — responsive padding/spacing */}
        <div className="flex-1 flex flex-col items-center px-6 sm:px-8 pt-6 sm:pt-10">

          {/* Logo — responsive size */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
            <Image
              src="/tglogo.png"
              alt="TG Logo"
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-contain"
              priority
            />
          </div>

          {/* Title — fluid text */}
          <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl font-bold text-black text-center">
            Download Our App
          </h1>

          <p className="mt-2 sm:mt-3 text-gray-500 text-center text-base sm:text-lg">
            Available on Android & iOS
          </p>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 mt-6 sm:mt-8" />

          {/* Store Buttons — responsive width, fluid sizes */}
          <div className="mt-6 sm:mt-10 flex flex-col gap-4 sm:gap-6 w-full items-center">

            <button
              onClick={() => window.open(playStoreLink, "_blank", "noopener,noreferrer")}
              className="w-full max-w-[260px] h-16 sm:h-[72px] border-2 border-black rounded-2xl bg-white flex overflow-hidden items-center justify-center active:scale-95 transition-transform"
              aria-label="Get on Google Play"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/playstore.png"
                  alt="Google Play"
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
            </button>

            <button
              onClick={() => window.open(appStoreLink, "_blank", "noopener,noreferrer")}
              className="w-full max-w-[260px] h-16 sm:h-[72px] border-2 border-black rounded-2xl bg-white flex overflow-hidden items-center justify-center active:scale-95 transition-transform"
              aria-label="Get on App Store"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/appstore.png"
                  alt="App Store"
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </div>

      </div>
      <Navbar />
    </main>
  );
}
