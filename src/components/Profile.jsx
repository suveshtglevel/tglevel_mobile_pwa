"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ChevronLeft,
  ChevronDown,
  Phone,
  CalendarDays,
  Camera,
} from "lucide-react";



export default function Profile() {
  const router = useRouter();

const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("    ");
const [gender, setGender] = useState("");
const [dob, setDob] = useState("");
const phoneNumber = "12345******";
const [genderOpen, setGenderOpen] = useState(false);    


  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 py-4">

        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/user-panel")}
            className="w-8 h-8 rounded-full border flex items-center justify-center"
            aria-label="Back to user panel"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center">

          <div className="relative">

            <div className="w-24 h-24 rounded-full border-4 border-green-600 overflow-hidden">
              <Image
                src="/profile.png"
                alt="profile"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>

            {/* camera button */}
            <button className="absolute bottom-1 right-0 bg-green-600 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
              <Camera size={14} className="text-white" />
            </button>
          </div>

          <h2 className="mt-4 text-xl font-semibold text-black">
            Update Profile
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Complete your details
          </p>
        </div>

        {/* Form */}
        <div className="mt-10 space-y-6">

          {/* Full Name */}
          <div className="border-b pb-3">

            <label className="text-xs text-gray-400 mb-2 block">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="w-full text-sm text-black outline-none bg-transparent"
            />
          </div>

          {/* Email */}
          <div className="border-b pb-3">

            <label className="text-xs text-gray-400 mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full text-sm text-black outline-none bg-transparent"
            />
          </div>

          {/* Phone Number */}
          <div className="border-b pb-3">

            <label className="text-xs text-gray-400 mb-2 block">
              Phone Number
            </label>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-black" />

              <input
                type="text"
                value={phoneNumber}
                disabled
                className="w-full text-sm text-gray-500 bg-transparent outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Gender */}
<div className="border-b pb-3">
  <label className="text-xs text-gray-400 mb-2 block">
    Gender
  </label>

  <div className="relative w-full">
    <button
      type="button"
      onClick={() => setGenderOpen((open) => !open)}
      className="w-full text-sm text-black bg-transparent outline-none flex items-center justify-between"
    >
      <span>{gender || "Select Gender"}</span>
      <ChevronDown size={18} className="text-gray-500 shrink-0" />
    </button>

    {genderOpen && (
      <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
        <button
          type="button"
          className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
          onClick={() => {
            setGender("male");
            setGenderOpen(false);
          }}
        >
          Male
        </button>

        <button
          type="button"
          className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
          onClick={() => {
            setGender("female");
            setGenderOpen(false);
          }}
        >
          Female
        </button>

        <button
          type="button"
          className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
          onClick={() => {
            setGender("other");
            setGenderOpen(false);
          }}
        >
          Other
        </button>
      </div>
    )}
  </div>
</div>

          {/* DOB */}
          <div className="border-b pb-3">

            <label className="text-xs text-gray-400 mb-2 block">
              Date of Birth
            </label>

            <div className="flex items-center justify-between">

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full text-sm text-black bg-transparent outline-none"
              />

            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-14 flex justify-center">

          <button className="bg-green-600 hover:bg-green-700 transition-all text-white px-10 py-3 rounded-xl font-medium w-full">
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}