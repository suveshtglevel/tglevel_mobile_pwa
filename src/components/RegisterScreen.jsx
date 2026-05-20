"use client";
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../redux/userSlice';

export const RegisterScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
    if (!phoneNumber) { setError('Please enter mobile number'); return; }
    if (!regex.test(phoneNumber)) { setError('Number must be 10 digits and start with 6, 7, 8, or 9'); return; }

    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phoneNumber }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setOtpSent(true);
        setResendTimer(60);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the complete 4-digit code.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: enteredOtp }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem("phone", phoneNumber);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("isNewUser", data.isNewUser ? "true" : "false");

        dispatch(
          updateProfile({
            isNewUser: data.isNewUser,
            hasCompletedOnboarding: true,
          })
        );

        router.push('/terms-condition');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch {
      setError('Verification failed. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value) || value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (error) setError('');
    if (value !== '' && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '']);
    setError('');
    setIsLoading(true);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phoneNumber }),
      });
      setResendTimer(60);
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (error) setError('');
    }
  };

  return (
    // ✅ Use min-h-app + scrollable container so nothing ever gets cut off on short screens.
    //    Use safe-area padding for notched / gesture-bar devices.
    //    Switched from h-screen + overflow-hidden (which was clipping the input + SEBI badge
    //    on iPhone SE 667h) to a flex column that allows scrolling when needed.
    <div className="min-h-app w-full bg-white flex justify-center pt-safe pb-safe">
      <div className="flex flex-col w-full max-w-md mx-auto bg-white font-sans px-5 sm:px-6 pt-6 sm:pt-10 pb-6">

        {/* Logo Section — responsive size, no fixed height block */}
        <div className={`flex items-center mb-4 sm:mb-6 transition-all ${otpSent ? 'justify-between' : 'justify-center'}`}>
          {otpSent && (
            <button
              onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); setError(''); setResendTimer(0); }}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <span className="text-2xl text-black leading-none">{"<"}</span>
            </button>
          )}
          <div className={`flex justify-center ${otpSent ? 'flex-1 -ml-10' : ''}`}>
            <Image
              src="/tglogo.png"
              alt="Company Logo"
              width={96}
              height={96}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              priority
            />
          </div>
        </div>

        {/* Heading — responsive font sizes */}
        <h2 className="text-2xl sm:text-3xl font-bold text-black leading-tight mb-2 text-center">
          Welcome to TG Levels
        </h2>

        <p className="text-gray-500 text-sm sm:text-base font-normal leading-snug text-center">
          Real-time stock insights at your fingertips
          <span className="hidden sm:inline"><br /></span>
          <span className="sm:hidden"> </span>
          — register or log in.
        </p>

        {/* Phone Input */}
        {!otpSent && (
          <div className={`flex items-center h-14 sm:h-16 w-full rounded-xl border mt-5 sm:mt-6 ${error ? 'border-red-500' : 'border-gray-100'} shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-all overflow-hidden`}>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="h-full px-2 bg-transparent text-gray-700 font-medium text-sm sm:text-base outline-none border-r border-gray-100 cursor-pointer"
            >
              <option value="+91" className="text-black">+91 (IN)</option>
            </select>
            <input
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Enter your mobile number"
              className="flex-1 min-w-0 h-full px-3 sm:px-4 bg-transparent text-black text-sm sm:text-base outline-none placeholder:text-gray-400 font-medium"
            />
          </div>
        )}

        {error && !otpSent && (
          <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>
        )}

        {/* OTP Fields — responsive width with min-w-0 so they shrink on small screens */}
        {otpSent && (
          <>
            <div className="flex justify-between gap-2 sm:gap-4 mt-6 sm:mt-8 mb-2 mx-1 sm:mx-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="flex-1 min-w-0 aspect-square max-w-[64px] border border-gray-200 rounded-xl text-center text-black text-xl sm:text-2xl font-bold focus:border-[#228B22] focus:ring-1 focus:ring-[#228B22] outline-none transition-all"
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-xs text-center mt-2 mb-2">{error}</p>}
          </>
        )}

        {/* CTA Button */}
        <div className="w-full mt-5 sm:mt-6">
          {!otpSent ? (
            <Button onClick={handleSendOtp} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          ) : (
            <Button
              onClick={handleVerify}
              disabled={isLoading}
              className={`transition-all ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          )}
        </div>

        {otpSent && (
          <p className="text-center text-sm text-gray-500 pt-5 mb-2">
            Didn&apos;t receive OTP?{' '}
            {resendTimer > 0 ? (
              <span className="font-semibold text-gray-600 ml-1">Resend in {resendTimer}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-[#228B22] font-bold hover:underline ml-1 disabled:opacity-50"
              >
                Resend
              </button>
            )}
          </p>
        )}

        {/* Hero image — fully responsive, no longer forced to bottom with mt-auto
            (mt-auto caused overlap on short screens). Uses normal flow with sensible margins. */}
        <div className="w-full flex justify-center mt-6 sm:mt-8">
          <Image
            src="/sirimage.png"
            alt="Tushar Ghone Image"
            width={500}
            height={500}
            className="w-[70%] max-w-[320px] h-auto object-contain"
          />
        </div>

        {/* SEBI Badge — responsive padding, will never overflow */}
        <div className="w-full flex justify-center mt-5 mb-2">
          <div className="inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 border border-purple-500 rounded-full bg-white max-w-full">
            <p className="text-xs sm:text-sm font-semibold text-black text-center">
              Tushar Ghone SEBI Registered Research Analyst
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
