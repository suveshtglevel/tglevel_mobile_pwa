"use client";

import { useState, useEffect } from "react";
import { Shield, Info, Database, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TermsConditionPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isViewMode = searchParams.get('mode') === 'view';

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = async () => {
    localStorage.setItem('terms_accepted', 'true');

    // ─── Step 1: Community Join (silent background) ───────────────────────
    const userId = localStorage.getItem('user_id');
    const isNewUser = localStorage.getItem('isNewUser') === 'true';
    const joinedKey = userId ? `communities_joined_${userId}` : null;
    const alreadyJoined = joinedKey ? localStorage.getItem(joinedKey) === 'true' : false;

    if (isNewUser && !alreadyJoined) {
      try {
        const response = await fetch('/api/auth/join', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ community_ids: [7, 9, 11, 13] }),
        });
        const data = await response.json();
        if (response.ok && (data.status === 'success' || data.status === true)) {
          if (joinedKey) localStorage.setItem(joinedKey, 'true');
        }
      } catch (error) {
        console.error('Community join failed:', error);
      }
    }

    // ─── Step 2: PWA Install FIRST ───────────────────────────────────────
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } catch (e) {
        console.error('PWA prompt error:', e);
      } finally {
        setDeferredPrompt(null);
      }
    }

    // ─── Step 3: Check Notification Permission ────────────────────────────
    if (Notification.permission === 'granted') {
      router.push('/chat');
      return;
    }

    if (Notification.permission === 'denied') {
      setShowBlockedModal(true);
      return;
    }

    // ─── Step 4: permission === 'default' — show custom modal ────────────
    setShowNotifModal(true);
  };

  const handleAllowNotification = async () => {
    setShowNotifModal(false);
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        router.push('/chat');
      } else {
        setShowBlockedModal(true);
      }
    } catch (e) {
      console.error('Notification permission error:', e);
    }
  };

  return (
    <div className="min-h-app w-full bg-[#F3F3F7] flex justify-center">
      <div className="w-full max-w-md relative">

        {/* Header */}
        <div className="bg-white h-16 sm:h-[74px] shadow-md flex items-center justify-center sticky top-0 z-50 pt-safe">
          {isViewMode && (
            <button
              onClick={() => router.back()}
              className="absolute left-3 sm:left-4 flex items-center gap-1 active:scale-95 transition-transform"
              aria-label="Back"
            >
              <ChevronLeft size={20} strokeWidth={2.5} className="text-black" />
              <span className="text-sm sm:text-[15px] font-medium text-black">Back</span>
            </button>
          )}
          <h1 className="text-lg sm:text-[22px] font-bold text-black">
            Terms & Conditions
          </h1>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 pb-40 sm:pb-[220px] space-y-8 sm:space-y-10">

          {/* USER AGREEMENT */}
          <section>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-1.5 sm:w-[8px] h-7 sm:h-[30px] bg-[#1E9B22] rounded-full shrink-0" />
              <h2 className="text-xl sm:text-[24px] font-bold text-[#121826]">
                User Agreement
              </h2>
            </div>
            <div className="bg-[#FAFAFA] rounded-2xl sm:rounded-[24px] p-5 sm:p-7 shadow-sm">
              <p className="text-sm sm:text-[18px] leading-[1.6] sm:leading-[1.7] text-[#4B5563]">
                By using this platform, you agree to avail research services
                including equity analysis, reports, and model portfolio
                recommendations. The Research Analyst (RA) will not execute
                trades, manage funds, hold Power of Attorney, or guarantee any
                returns. Fees must be paid via bank transfer/UPI only — no
                cash. Your investment decisions remain solely yours based on
                your declared risk profile. The RA or associates may hold
                positions in recommended securities, which will be disclosed.
                Either party may terminate this agreement with 30 days&apos; written
                notice. For grievances, contact our Grievance Officer or write
                to SEBI SCORES at scores.gov.in.
              </p>
            </div>
          </section>

          {/* SEBI DISCLAIMER */}
          <section>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-1.5 sm:w-[8px] h-7 sm:h-[30px] bg-[#1E9B22] rounded-full shrink-0" />
              <h2 className="text-xl sm:text-[24px] font-bold text-[#121826]">
                SEBI Disclaimer
              </h2>
            </div>
            <div className="bg-[#F0F2FF] rounded-2xl sm:rounded-[24px] p-5 sm:p-7 shadow-sm flex gap-3 sm:gap-4">
              <div className="min-w-[36px] w-9 h-9 sm:min-w-[40px] sm:w-10 sm:h-10 rounded-full bg-[#2F7A5F] flex items-center justify-center mt-1 shrink-0">
                <Info size={18} className="text-white sm:w-5 sm:h-5" />
              </div>
              <p className="text-sm sm:text-[18px] leading-[1.6] sm:leading-[1.8] text-[#4B5563]">
                Investments in the market are subject to market risk. Please
                read all related documents carefully before investing.
                Registration granted by SEBI, Enlistment as RA with Exchange
                and certification from NISM in no way guarantee performance of
                the intermediary or provide any assurance of returns to
                investors.
              </p>
            </div>
          </section>

          {/* DPDP */}
          <section>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-1.5 sm:w-[8px] h-7 sm:h-[30px] bg-[#B8E7D4] rounded-full shrink-0" />
              <h2 className="text-xl sm:text-[24px] font-bold text-[#121826]">
                DPDP Act — Data Privacy
              </h2>
            </div>
            <div className="bg-[#FAFAFA] rounded-2xl sm:rounded-[24px] p-5 sm:p-7 shadow-sm">
              <p className="text-sm sm:text-[18px] leading-[1.6] sm:leading-[1.8] text-[#4B5563] mb-6 sm:mb-8">
                We collect your personal data (name, PAN, email, phone, bank
                details, risk profile) solely for providing research services,
                KYC compliance, fee processing, and regulatory record-keeping.
                Your data is never sold or shared beyond payment processors and
                regulatory authorities.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-[#DDF1E7] rounded-2xl sm:rounded-[18px] p-4 sm:p-5">
                  <Shield className="text-[#2F7A5F] mb-2 sm:mb-3" size={22} />
                  <h3 className="text-[#2F7A5F] font-bold text-[13px] sm:text-[16px]">ACCESS RIGHTS</h3>
                </div>
                <div className="bg-[#DDF1E7] rounded-2xl sm:rounded-[18px] p-4 sm:p-5">
                  <Database className="text-[#2F7A5F] mb-2 sm:mb-3" size={22} />
                  <h3 className="text-[#2F7A5F] font-bold text-[13px] sm:text-[16px]">5-YEAR RETENTION</h3>
                </div>
              </div>
              <p className="text-sm sm:text-[18px] leading-[1.6] sm:leading-[1.8] text-[#4B5563]">
                You have the right to access, correct, erase, or withdraw
                consent to your data at any time — requests are responded to
                within 90 days. Data is retained for 5 years as per SEBI
                compliance requirements.
              </p>
            </div>
          </section>

          {/* Agreement confirmation */}
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-[16px] bg-[#DDF1E7]">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#1E9B22]">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-xs sm:text-[13px] leading-[1.5] text-[#374151]">
              I have read, understood, and agree to the{" "}
              <span className="font-semibold text-[#064E3B]">User Agreement</span>,{" "}
              <span className="font-semibold text-[#064E3B]">SEBI Disclaimer</span>, and{" "}
              <span className="font-semibold text-[#064E3B]">DPDP Act — Data Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Bottom Fixed Button */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-t-[28px] p-4 sm:p-6 shadow-2xl"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            <button
              disabled={isViewMode}
              className={`w-full h-12 sm:h-[64px] rounded-full text-white text-base sm:text-[20px] font-semibold transition-all active:scale-[0.99]
                ${isViewMode
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#1E9B22]'}`}
              onClick={!isViewMode ? handleClick : undefined}
            >
              {isViewMode ? 'Read Only' : 'Confirm & Continue →'}
            </button>
          </div>
        </div>

        {/* ─── Custom Notification Permission Modal ──────────────────────── */}
        {showNotifModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60">
            <div
              className="w-full max-w-md bg-white rounded-t-3xl p-6 space-y-5 shadow-2xl"
              style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#DDF1E7] flex items-center justify-center">
                  <span className="text-3xl">🔔</span>
                </div>
              </div>

              {/* Text */}
              <div className="text-center space-y-2">
                <h3 className="text-[18px] font-bold text-[#121826]">
                  Enable Notifications
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Stay updated with the latest stock research,
                  alerts, and portfolio updates in real time.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-[#F3F3F7] rounded-2xl p-3">
                  <span className="text-lg">📈</span>
                  <p className="text-sm text-[#374151]">Real-time stock alerts</p>
                </div>
                <div className="flex items-center gap-3 bg-[#F3F3F7] rounded-2xl p-3">
                  <span className="text-lg">📊</span>
                  <p className="text-sm text-[#374151]">Model portfolio updates</p>
                </div>
                <div className="flex items-center gap-3 bg-[#F3F3F7] rounded-2xl p-3">
                  <span className="text-lg">📋</span>
                  <p className="text-sm text-[#374151]">New research reports</p>
                </div>
              </div>

              {/* ONLY Allow button */}
              <button
                onClick={handleAllowNotification}
                className="w-full h-14 rounded-full bg-[#1E9B22] text-white text-[16px] font-semibold active:scale-[0.99] transition-all"
              >
                Allow Notifications 🔔
              </button>
            </div>
          </div>
        )}

        {/* ─── Notifications Blocked Modal ───────────────────────────────── */}
        {showBlockedModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl">

              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <p className="text-gray-400 text-xs mb-1">your-site.com says</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔔</span>
                  <h3 className="text-white text-[15px] font-semibold">
                    Notifications are blocked.
                  </h3>
                </div>
              </div>

              {/* SVG Illustration */}
              <div className="mx-4 rounded-xl overflow-hidden border border-white/10 bg-[#2A2A2A]">
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  <defs>
                    <marker id="arrowYellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#FFD700" />
                    </marker>
                    <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#1E9B22" />
                    </marker>
                  </defs>

                  <rect width="320" height="180" fill="#2A2A2A" />

                  {/* Address bar */}
                  <rect x="10" y="10" width="300" height="32" rx="8" fill="#3A3A3A" />
                  <rect x="18" y="18" width="18" height="16" rx="3" fill="#555" />
                  <text x="27" y="30" textAnchor="middle" fontSize="11" fill="white">🔒</text>
                  <text x="95" y="30" fontSize="9" fill="#aaa">your-site.trycloudflare.com</text>

                  {/* Arrow to lock */}
                  <line x1="27" y1="46" x2="27" y2="56" stroke="#FFD700" strokeWidth="2" markerEnd="url(#arrowYellow)" />
                  <text x="38" y="62" fontSize="8" fill="#FFD700" fontWeight="bold">① Tap lock</text>

                  {/* Dropdown */}
                  <rect x="8" y="66" width="185" height="106" rx="8" fill="#3D3D3D" stroke="#555" strokeWidth="1" />
                  <text x="18" y="82" fontSize="8" fill="#aaa">Site settings</text>
                  <line x1="8" y1="88" x2="193" y2="88" stroke="#555" strokeWidth="0.5" />

                  {/* Notifications row — highlighted */}
                  <rect x="8" y="88" width="185" height="30" fill="#4A4A4A" />
                  <text x="18" y="107" fontSize="9" fill="white" fontWeight="bold">🔔 Notifications</text>
                  <rect x="128" y="94" width="52" height="17" rx="4" fill="#FF4444" />
                  <text x="154" y="106" textAnchor="middle" fontSize="8" fill="white">Blocked</text>

                  {/* Arrow to notifications */}
                  <line x1="230" y1="103" x2="196" y2="103" stroke="#FFD700" strokeWidth="2" markerEnd="url(#arrowYellow)" />
                  <text x="232" y="99" fontSize="8" fill="#FFD700" fontWeight="bold">② Find this</text>

                  {/* Allow row */}
                  <rect x="8" y="118" width="185" height="28" rx="0" fill="#3D3D3D" />
                  <text x="18" y="135" fontSize="8" fill="#aaa">Change to:</text>
                  <rect x="95" y="122" width="55" height="18" rx="4" fill="#1E9B22" />
                  <text x="122" y="134" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">✓ Allow</text>

                  {/* Arrow to Allow */}
                  <line x1="230" y1="131" x2="153" y2="131" stroke="#1E9B22" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                  <text x="232" y="127" fontSize="8" fill="#1E9B22" fontWeight="bold">③ Set Allow</text>
                </svg>
              </div>

              {/* Steps */}
              <div className="px-5 py-4 space-y-1">
                <p className="text-gray-300 text-xs">To enable:</p>
                <p className="text-gray-300 text-xs">1. Tap the 🔒 lock icon in your browser address bar</p>
                <p className="text-gray-300 text-xs">2. Find <span className="text-white font-semibold">Notifications</span></p>
                <p className="text-gray-300 text-xs">3. Set to <span className="text-[#1E9B22] font-semibold">Allow</span></p>
                <p className="text-gray-300 text-xs">4. Refresh the page</p>
              </div>

              {/* Buttons */}
              <div className="flex border-t border-white/10">
                <button
                  onClick={() => setShowBlockedModal(false)}
                  className="flex-1 py-3 text-sm text-gray-400 border-r border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowBlockedModal(false); window.location.reload(); }}
                  className="flex-1 py-3 text-sm text-[#1E9B22] font-semibold"
                >
                  Refresh ↺
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}