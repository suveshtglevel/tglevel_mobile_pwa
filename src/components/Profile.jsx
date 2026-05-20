"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import {
  ChevronLeft,
  ChevronDown,
  Phone,
  Camera,
  CheckCircle,
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");
  const isReadOnly = from === "user-panel";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (phone) setPhoneNumber(phone);

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/edit-profile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.status === "success") {
          if (data.name) setFullName(data.name);
          if (data.email) setEmail(data.email);
          if (data.gender) setGender(data.gender.toLowerCase());

          if (data.dob) {
            const formatted = data.dob.includes("T")
              ? data.dob.split("T")[0]
              : data.dob;
            setDob(formatted);
          }

          if (data.phone) setPhoneNumber(data.phone);

          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("phone", data.phone || phone || "");
          localStorage.setItem(
            "userProfile",
            JSON.stringify({
              fullName: data.name,
              email: data.email,
              gender: data.gender?.toLowerCase(),
              dob: data.dob,
              phone: data.phone,
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!gender) newErrors.gender = "Please select a gender";
    if (!dob) newErrors.dob = "Date of birth is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phoneNumber);
      formData.append("gender", gender);
      formData.append("dob", dob);

      const response = await fetch("/api/user/edit-profile", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            gender,
            dob,
            phone: phoneNumber,
          })
        );

        setShowToast(true);

        setTimeout(() => {
          if (from === "crm") {
            router.push("/support-chat");
          } else {
            router.push("/user-panel");
          }
        }, 1500);
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-app w-full bg-white flex justify-center pt-safe pb-safe">
      <div className="w-full max-w-md px-4 sm:px-5 py-4">

        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={() => router.push("/user-panel")}
            className="w-9 h-9 rounded-full border flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Profile pic */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-green-600 overflow-hidden">
              <Image src="/profile.png" alt="profile" width={112} height={112} className="w-full h-full object-cover" />
            </div>

            {!isReadOnly && (
              <button
                className="absolute bottom-0 right-0 bg-green-600 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-white active:scale-95 transition-transform"
                aria-label="Change profile photo"
              >
                <Camera size={14} className="text-white" />
              </button>
            )}
          </div>

          <h2 className="mt-4 text-lg sm:text-xl font-semibold">Profile</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {isFetching
              ? "Loading your details..."
              : isReadOnly
              ? "Viewing your details"
              : "Complete your details"}
          </p>
        </div>

        {/* Form — larger text + comfortable line height for fingers */}
        <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">

          <div className="border-b pb-3">
            <label className="text-xs text-gray-400">Full Name</label>
            <input
              type="text"
              value={fullName}
              readOnly={isReadOnly}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-sm sm:text-base bg-transparent outline-none py-1"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div className="border-b pb-3">
            <label className="text-xs text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              readOnly={isReadOnly}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm sm:text-base bg-transparent outline-none py-1"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="border-b pb-3">
            <label className="text-xs text-gray-400">Phone</label>
            <div className="flex items-center gap-2 py-1">
              <Phone size={16} className="shrink-0" />
              <input
                type="text"
                value={phoneNumber}
                disabled
                className="w-full text-sm sm:text-base bg-transparent text-gray-700"
              />
            </div>
          </div>

          <div className="border-b pb-3 relative">
            <label className="text-xs text-gray-400">Gender</label>
            <button
              type="button"
              onClick={() => { if (!isReadOnly) setGenderOpen(!genderOpen); }}
              className="w-full flex justify-between items-center text-sm sm:text-base py-1 text-left capitalize"
            >
              <span className={gender ? "text-black" : "text-gray-400"}>
                {gender || "Select Gender"}
              </span>
              <ChevronDown size={16} className="shrink-0" />
            </button>

            {genderOpen && !isReadOnly && (
              <div className="absolute w-full bg-white border mt-2 rounded shadow z-20">
                {["male", "female", "other"].map((g) => (
                  <button
                    key={g}
                    className="block w-full text-left px-3 py-2 text-sm sm:text-base hover:bg-gray-100 capitalize"
                    onClick={() => { setGender(g); setGenderOpen(false); }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div className="border-b pb-3">
            <label className="text-xs text-gray-400">DOB</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
              className="w-full text-sm sm:text-base bg-transparent py-1"
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
        </div>

        {/* Button */}
        {!isReadOnly && (
          <div className="mt-8 sm:mt-10">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-green-600 disabled:bg-green-400 text-white w-full py-3 sm:py-3.5 rounded-xl text-base sm:text-lg font-semibold active:scale-[0.99] transition-transform"
            >
              {isLoading ? "Saving..." : "Update Profile"}
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        >
          <CheckCircle size={16} /> Saved
        </div>
      )}
    </div>
  );
}
