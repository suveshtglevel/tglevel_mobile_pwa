"use client";

import { useState, useEffect } from "react";
import { Shield, Info, Database } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsConditionPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const router = useRouter();

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

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        router.push("/chat");
      }
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F7] flex justify-center">
      <div className="w-full max-w-[390px]">

        {/* Header */}
        <div className="bg-white h-[74px] shadow-md flex items-center justify-center sticky top-0 z-50">
          <h1 className="text-[22px] font-bold text-black">
            Terms & Conditions
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-8 pb-[220px] space-y-10">

          {/* USER AGREEMENT */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[8px] h-[30px] bg-[#1E9B22] rounded-full" />
              <h2 className="text-[24px] font-bold text-[#121826]">
                User Agreement
              </h2>
            </div>
            <div className="bg-[#FAFAFA] rounded-[24px] p-7 shadow-sm">
              <p className="text-[18px] leading-[1.7] text-[#4B5563]">
                By using this platform, you agree to avail research services
                including equity analysis, reports, and model portfolio
                recommendations. The Research Analyst (RA) will not execute
                trades, manage funds, hold Power of Attorney, or guarantee any
                returns. Fees must be paid via bank transfer/UPI only — no
                cash. Your investment decisions remain solely yours based on
                your declared risk profile. The RA or associates may hold
                positions in recommended securities, which will be disclosed.
                Either party may terminate this agreement with 30 days' written
                notice. For grievances, contact our Grievance Officer or write
                to SEBI SCORES at scores.gov.in.
              </p>
            </div>
          </section>

          {/* SEBI DISCLAIMER */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[8px] h-[30px] bg-[#1E9B22] rounded-full" />
              <h2 className="text-[24px] font-bold text-[#121826]">
                SEBI Disclaimer
              </h2>
            </div>
            <div className="bg-[#F0F2FF] rounded-[24px] p-7 shadow-sm flex gap-4">
              <div className="min-w-[40px] h-[40px] rounded-full bg-[#2F7A5F] flex items-center justify-center mt-1">
                <Info size={20} className="text-white" />
              </div>
              <p className="text-[18px] leading-[1.8] text-[#4B5563]">
                Investments in the market are subject to market risk. Please
                read all related documents carefully before investing.
                Registration granted by SEBI, Enlistment as RA with Exchange
                and certification from NIr M in no way guarantee performance of
                the intermediary or provide any assurance of returns to
                investors.
              </p>
            </div>
          </section>

          {/* DPDP */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[8px] h-[30px] bg-[#B8E7D4] rounded-full" />
              <h2 className="text-[24px] font-bold text-[#121826]">
                DPDP Act — Data Privacy
              </h2>
            </div>
            <div className="bg-[#FAFAFA] rounded-[24px] p-7 shadow-sm">
              <p className="text-[18px] leading-[1.8] text-[#4B5563] mb-8">
                We collect your personal data (name, PAN, email, phone, bank
                details, risk profile) solely for providing research services,
                KYC compliance, fee processing, and regulatory record-keeping.
                Your data is never sold or shared beyond payment processors and
                regulatory authorities.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#DDF1E7] rounded-[18px] p-5">
                  <Shield className="text-[#2F7A5F] mb-3" size={26} />
                  <h3 className="text-[#2F7A5F] font-bold text-[16px]">ACCESS RIGHTS</h3>
                </div>
                <div className="bg-[#DDF1E7] rounded-[18px] p-5">
                  <Database className="text-[#2F7A5F] mb-3" size={26} />
                  <h3 className="text-[#2F7A5F] font-bold text-[16px]">5-YEAR RETENTION</h3>
                </div>
              </div>
              <p className="text-[18px] leading-[1.8] text-[#4B5563]">
                You have the right to access, correct, erase, or withdraw
                consent to your data at any time — requests are responded to
                within 90 days. Data is retained for 5 years as per SEBI
                compliance requirements.
              </p>
            </div>
          </section>

          {/* ✅ Agreement confirmation at bottom */}
          <div className="flex items-center gap-3 p-4 rounded-[16px] bg-[#DDF1E7]">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#1E9B22]">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-[13px] leading-[1.5] text-[#374151]">
              I have read, understood, and agree to the{" "}
              <span className="font-semibold text-[#064E3B]">User Agreement</span>,{" "}
              <span className="font-semibold text-[#064E3B]">SEBI Disclaimer</span>, and{" "}
              <span className="font-semibold text-[#064E3B]">DPDP Act — Data Privacy Policy</span>.
            </p>
          </div>

        </div>

        {/* Bottom Fixed Button */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-6 shadow-2xl">
            <button
              className="w-full h-[64px] rounded-full text-white text-[20px] font-semibold transition-all bg-[#1E9B22]"
              onClick={handleClick}
            >
              Confirm & Continue →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}