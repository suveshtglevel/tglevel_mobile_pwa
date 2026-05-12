"use client";
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { updateProfile } from '@/redux/userSlice';
import { api } from '@/utils/apiHelper';

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
      const response = await api.post('/auth/send-otp', { mobile: phoneNumber });
      if (response.data.status === true) {
        setOtpSent(true);
        setResendTimer(60);
      } else {
        setError(response.data.message || 'Failed to send OTP.');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) { setError('Please enter the complete 4-digit code.'); return; }

    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        mobile: phoneNumber,
        otp: Number(enteredOtp),
      });

      if (response.data.status === true) {
        localStorage.setItem('auth_token', response.data.token);

        if (response.data.is_new_user === true) {
          dispatch(updateProfile({ isNewUser: true, hasCompletedOnboarding: false }));
        } else {
          dispatch(updateProfile({ isNewUser: false, hasCompletedOnboarding: true }));
        }

        router.push('/terms-condition'); // ✅ fixed
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
      await api.post('/auth/send-otp', { mobile: phoneNumber });
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
    <div className="flex flex-col h-screen px-6 pt-12 bg-white max-w-md mx-auto font-sans overflow-hidden">
      {/* Logo Section */}
      <div className={`flex items-center h-24 mb-8 transition-all ${otpSent ? 'justify-between' : 'justify-center'}`}>
        {otpSent && (
          <button
            onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); setError(''); setResendTimer(0); }}
            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <span className="text-2xl text-black">{"<"}</span>
          </button>
        )}
        <div className={`w-24 h-24 ${otpSent ? 'absolute left-1/2 transform -translate-x-1/2' : ''}`}>
          <Image src="/tglogo.png" alt="Company Logo" width={96} height={96} />
        </div>
      </div>

      <h2 className="text-[32px] font-bold text-black leading-tight mb-2 mx-auto text-center">
        Welcome to TG Levels
      </h2>

      <p className="text-gray-500 text-md font-normal leading-tight mx-auto text-center">
        Real-time stock insights at your fingertips <br />— register or log in.
      </p>

      {/* Phone Input */}
      {!otpSent && (
        <div className={`flex items-center h-16 w-full rounded-xl border mt-6 ${error ? 'border-red-500' : 'border-gray-100'} shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-all overflow-hidden`}>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="h-full px-1 bg-transparent text-gray-700 font-medium outline-none border-r border-gray-100 cursor-pointer"
          >
            <option value="+91" className="text-black">+91 (IN)</option>
          </select>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter your mobile number"
            className="flex-1 h-full px-4 bg-transparent text-black outline-none placeholder:text-gray-400 font-medium"
          />
        </div>
      )}

      {error && !otpSent && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}

      {/* OTP Fields */}
      {otpSent && (
        <>
          <div className="flex justify-between gap-4 mt-8 mb-2 mx-4 min-h-[50px]">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-14 h-14 border border-gray-200 rounded-xl text-center text-black text-2xl font-bold focus:border-[#228B22] focus:ring-1 focus:ring-[#228B22] outline-none transition-all"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-xs text-center mt-2 mb-2">{error}</p>}
        </>
      )}

      <div className="w-full mt-6">
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
        <p className="text-center text-sm text-gray-500 pt-6 mb-2">
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

      <div className="mt-auto w-full flex justify-center pb-14">
        <Image
          src="/sirimage.png"
          alt="Tushar Ghone Image"
          width={500}
          height={500}
          className="w-[75vw] max-w-[350px] h-auto object-contain"
        />
      </div>

      <div className="inline-flex items-center justify-center px-5 py-2 border border-purple-500 rounded-full bg-white mb-20">
        <p className="text-sm font-semibold text-black whitespace-nowrap">
          Tushar Ghone SEBI Registered Research Analyst
        </p>
      </div>
    </div>
  );
};

