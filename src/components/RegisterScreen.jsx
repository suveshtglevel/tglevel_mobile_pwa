"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/userSlice";
import { ChevronLeft } from "lucide-react";

export const RegisterScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!otpSent || resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const handleSendOtp = async () => {
    const regex = /^[6789]\d{9}$/;

    if (!phoneNumber) {
      setError("Please enter mobile number");
      return;
    }

    if (!regex.test(phoneNumber)) {
      setError(
        "Number must be 10 digits and start with 6, 7, 8, or 9"
      );
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setOtpSent(true);
        setResendTimer(60);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("phone", phoneNumber);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem(
          "isNewUser",
          data.isNewUser ? "true" : "false"
        );

        window.dispatchEvent(new Event('trial-session-changed'));

        dispatch(
          updateProfile({
            isNewUser: data.isNewUser,
            hasCompletedOnboarding: true,
          })
        );

        router.push("/terms-condition");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch {
      setError("Verification failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value) || value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError("");

    if (value !== "" && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    setError("");
    setIsLoading(true);

    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phoneNumber,
        }),
      });

      setResendTimer(60);
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setPhoneNumber(value);

      if (error) setError("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center overflow-x-hidden">
      <div
        className="
          w-full
          max-w-[375px]
          min-h-screen
          bg-white
          flex
          flex-col
          px-4
          pt-6
          pb-5
        "
      >
        {/* Header */}
        <div className="relative flex items-center justify-center mb-5 h-[72px]">
          {otpSent && (
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp(["", "", "", ""]);
                setError("");
                setResendTimer(0);
              }}
              
              className="
                absolute
                left-0
                w-10
                h-10
                rounded-xl
                border
                border-[#EAEAEA]
                flex
                items-center
                justify-center
                bg-white
                z-10
                active:scale-95
                transition-all
              "
            >
              <span className="text-xl text-black"><ChevronLeft size={20} strokeWidth={2.5} className="text-black" /></span>
            </button>
          )}

          <div className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/tglogo.png"
              alt="Company Logo"
              width={72}
              height={72}
              priority
              className="w-[72px] h-[72px] object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[28px] font-bold text-black leading-[34px] mb-2 text-center">
          Welcome to TG Levels!
        </h2>

        {/* Subtitle */}
        <p className="text-[#666] text-[14px] leading-[20px] text-center">
          Real-time stock insights at your fingertips
          <br />
          — register or log in.
        </p>

        {/* Form Section */}
        <div className="mt-6">
          {/* Phone Input */}
          {!otpSent && (
            <>
              <div
                className={`
                  h-[56px]
                  w-full
                  rounded-[14px]
                  border
                  ${
                    error
                      ? "border-red-500"
                      : "border-[#EAEAEA]"
                  }
                  bg-white
                  flex
                  items-center
                  overflow-hidden
                  shadow-sm
                `}
              >
                {/* Static +91 */}
                <div
                  className="
                    h-full
                    px-4
                    flex
                    items-center
                    justify-center
                    text-[14px]
                    font-medium
                    text-[#555]
                    border-r
                    border-[#EFEFEF]
                    bg-[#FAFAFA]
                    select-none
                    pointer-events-none
                  "
                >
                  +91
                </div>

                {/* Input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter your mobile number"
                  className="
                    flex-1
                    h-full
                    px-4
                    text-[14px]
                    text-black
                    outline-none
                    placeholder:text-[#B0B0B0]
                    bg-transparent
                  "
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-2 ml-1">
                  {error}
                </p>
              )}
            </>
          )}

          {/* OTP */}
          {otpSent && (
            <>
              <div className="flex justify-between gap-3 mt-2 mb-2 w-full">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, i)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, i)
                    }
                    className="
                      w-[56px]
                      h-[56px]
                      border
                      border-[#E5E5E5]
                      rounded-[12px]
                      text-center
                      text-[22px]
                      font-semibold
                      outline-none
                      transition-all
                      focus:border-[#228B22]
                      focus:ring-2
                      focus:ring-[#228B22]/20
                    "
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center mt-2">
                  {error}
                </p>
              )}
            </>
          )}

          {/* Button */}
          <div className="w-full mt-5">
            {!otpSent ? (
              <Button
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <Button
                onClick={handleVerify}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            )}
          </div>

          {/* Resend */}
          {otpSent && (
            <p className="text-center text-[12px] text-[#666] mt-3">
              Didn&apos;t receive OTP?{" "}
              {resendTimer > 0 ? (
                <span className="font-semibold">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="
                    text-[#228B22]
                    font-semibold
                    active:opacity-70
                  "
                >
                  Resend
                </button>
              )}
            </p>
          )}
        </div>

        {/* Bottom Image */}
        <div className="w-full flex justify-center mt-[clamp(2rem,6vh,4rem)]">
          <Image
            src="/sirimage.png"
            alt="Tushar Ghone"
            width={260}
            height={260}
            className="
              w-full
              max-w-[260px]
              h-auto
              object-contain
            "
          />
        </div>

        {/* Badge */}
        <div className="w-full flex justify-center mt-4">
          <div
            className="
              px-4
              py-2
              border
              border-[#6B46C1]
              rounded-full
              bg-white
            "
          >
            <p
              className="
                text-[11px]
                font-medium
                text-black
                text-center
                whitespace-nowrap
              "
            >
              Tushar Ghone SEBI Registered Research Analyst
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};