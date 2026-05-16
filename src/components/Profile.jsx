// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// import {
//   ChevronLeft,
//   ChevronDown,
//   Phone,
//   CalendarDays,
//   Camera,
// } from "lucide-react";



// export default function Profile() {
//   const router = useRouter();

// const [fullName, setFullName] = useState("");
// const [email, setEmail] = useState("    ");
// const [gender, setGender] = useState("");
// const [dob, setDob] = useState("");
// const [phoneNumber, setPhoneNumber] = useState("");
// const [genderOpen, setGenderOpen] = useState(false);    


// useEffect(() => {
//   const savedPhone = localStorage.getItem("phone");
//   if (savedPhone) {
//     setPhoneNumber(savedPhone);
//   }
// }, []);


// const handleCreateProfile = async () => {
//   try {
//     const formData = new FormData();

//     formData.append("name", fullName);
//     formData.append("email", email);
//     formData.append("gender", gender);
//     formData.append("dob", dob);

//     // if API expects phone (optional)
//     formData.append("phone", phoneNumber);

//     const response = await fetch("/api/user/edit-profile", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();

//     if (data.status === "success") {
//       console.log("Profile updated");

//       // ✅ redirect or next step
//       router.push("/user-panel"); // or dashboard
//     } else {
//       console.log("Error:", data.message);
//     }
//   } catch (error) {
//     console.log("API error:", error);
//   }
// };

//   return (
//     <div className="min-h-screen bg-white flex justify-center">
//       <div className="w-full max-w-sm px-5 py-4">

//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <button
//             onClick={() => router.push("/user-panel")}
//             className="w-8 h-8 rounded-full border flex items-center justify-center"
//             aria-label="Back to user panel"
//           >
//             <ChevronLeft size={18} />
//           </button>
//         </div>

//         {/* Profile Section */}
//         <div className="flex flex-col items-center">

//           <div className="relative">

//             <div className="w-24 h-24 rounded-full border-4 border-green-600 overflow-hidden">
//               <Image
//                 src="/profile.png"
//                 alt="profile"
//                 width={100}
//                 height={100}
//                 className="object-cover w-full h-full"
//               />
//             </div>

//             {/* camera button */}
//             <button className="absolute bottom-1 right-0 bg-green-600 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
//               <Camera size={14} className="text-white" />
//             </button>
//           </div>

//           <h2 className="mt-4 text-xl font-semibold text-black">
//             Update Profile
//           </h2>

//           <p className="text-sm text-gray-400 mt-1">
//             Complete your details
//           </p>
//         </div>

//         {/* Form */}
//         <div className="mt-10 space-y-6">

//           {/* Full Name */}
//           <div className="border-b pb-3">

//             <label className="text-xs text-gray-400 mb-2 block">
//               Full Name
//             </label>

//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Enter full name"
//               className="w-full text-sm text-black outline-none bg-transparent"
//             />
//           </div>

//           {/* Email */}
//           <div className="border-b pb-3">

//             <label className="text-xs text-gray-400 mb-2 block">
//               Email Address
//             </label>

//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email"
//               className="w-full text-sm text-black outline-none bg-transparent"
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="border-b pb-3">

//             <label className="text-xs text-gray-400 mb-2 block">
//               Phone Number
//             </label>

//             <div className="flex items-center gap-3">
//               <Phone size={18} className="text-black" />

//               <input
//                 type="text"
//                 value={phoneNumber}
//                 disabled
//                 className="w-full text-sm text-gray-500 bg-transparent outline-none cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Gender */}
// <div className="border-b pb-3">
//   <label className="text-xs text-gray-400 mb-2 block">
//     Gender
//   </label>

//   <div className="relative w-full">
//     <button
//       type="button"
//       onClick={() => setGenderOpen((open) => !open)}
//       className="w-full text-sm text-black bg-transparent outline-none flex items-center justify-between"
//     >
//       <span>{gender || "Select Gender"}</span>
//       <ChevronDown size={18} className="text-gray-500 shrink-0" />
//     </button>

//     {genderOpen && (
//       <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
//         <button
//           type="button"
//           className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
//           onClick={() => {
//             setGender("male");
//             setGenderOpen(false);
//           }}
//         >
//           Male
//         </button>

//         <button
//           type="button"
//           className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
//           onClick={() => {
//             setGender("female");
//             setGenderOpen(false);
//           }}
//         >
//           Female
//         </button>

//         <button
//           type="button"
//           className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
//           onClick={() => {
//             setGender("other");
//             setGenderOpen(false);
//           }}
//         >
//           Other
//         </button>
//       </div>
//     )}
//   </div>
// </div>

//           {/* DOB */}
//           <div className="border-b pb-3">

//             <label className="text-xs text-gray-400 mb-2 block">
//               Date of Birth
//             </label>

//             <div className="flex items-center justify-between">

//               <input
//                 type="date"
//                 value={dob}
//                 onChange={(e) => setDob(e.target.value)}
//                 className="w-full text-sm text-black bg-transparent outline-none"
//               />

//             </div>
//           </div>
//         </div>

//         {/* Button */}
//         <div className="mt-14 flex justify-center">

//           <button className="bg-green-600 hover:bg-green-700 transition-all text-white px-10 py-3 rounded-xl font-medium w-full"
//           onClick={handleCreateProfile} >
//             Create Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   ChevronLeft,
//   ChevronDown,
//   Phone,
//   Camera,
// } from "lucide-react";

// export default function Profile() {
//   const router = useRouter();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [gender, setGender] = useState("");
//   const [dob, setDob] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [userId, setUserId] = useState("");
//   const [genderOpen, setGenderOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   // ✅ Load data from localStorage
//   // useEffect(() => {
//   //   const savedPhone = localStorage.getItem("phone");
//   //   const savedUserId = localStorage.getItem("user_id");

//   //   if (savedPhone) setPhoneNumber(savedPhone);
//   //   if (savedUserId) setUserId(savedUserId);
//   // }, []);

//   useEffect(() => {
//   const savedPhone = localStorage.getItem("phone");
//   const savedUserId = localStorage.getItem("user_id");

//   if (savedPhone) setPhoneNumber(savedPhone);
//   if (savedUserId) setUserId(savedUserId);

//   // ✅ Fetch profile data
//   const fetchProfile = async () => {
//     try {
//       const res = await fetch("/api/user/edit-profile", {
//         method: "GET", // or GET depending on your API
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_id: savedUserId }),
//       });

//       const data = await res.json();

//       if (data.status === "success") {
//         const profile = data.data;

//         // ✅ Prefill fields if data exists
//         setFullName(profile.full_name || "");
//         setEmail(profile.email || "");
//         setGender(profile.gender || "");
//         setDob(profile.dob || "");

//         // optional safety
//         if (profile.phone) {
//           setPhoneNumber(profile.phone);
//           localStorage.setItem("phone", profile.phone);
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch profile", err);
//     }
//   };

//   if (savedUserId) {
//     fetchProfile();
//   }
// }, []);

//   // ✅ Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     try {
//       const formData = new FormData();

//       // ✅ REQUIRED FIELDS (as per backend)
//       formData.append("user_id", userId);
//       formData.append("old_image", ""); // no image for now

//       formData.append("full_name", fullName.trim());
//       formData.append("email", email.trim());
//       formData.append("phone", phoneNumber);
//       formData.append("gender", gender);
//       formData.append("dob", dob);

//       const res = await fetch("/api/user/edit-profile", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       console.log(data);

//       if (data.status === "success") {
//   localStorage.setItem("profileCompleted", "true");

//   // ✅ ADD THIS (fix your issue)
//   localStorage.setItem("phone", phoneNumber);

//   // ✅ SHOW SUCCESS TOAST
//   setSuccess(true);

//   setTimeout(() => {
//     router.push("/user-panel");
//   }, 2000);
// } else {
//         alert(data.message || "Something went wrong");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex justify-center">
//       <div className="w-full max-w-sm px-5 py-4">

//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <button
//             onClick={() => router.push("/user-panel")}
//             className="w-8 h-8 rounded-full border flex items-center justify-center"
//           >
//             <ChevronLeft size={18} />
//           </button>
//         </div>

//         {/* Profile */}
//         <div className="flex flex-col items-center">
//           <div className="relative">
//             <div className="w-24 h-24 rounded-full border-4 border-green-600 overflow-hidden">
//               <Image
//                 src="/profile.png"
//                 alt="profile"
//                 width={100}
//                 height={100}
//               />
//             </div>

//             <button className="absolute bottom-1 right-0 bg-green-600 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
//               <Camera size={14} className="text-white" />
//             </button>
//           </div>

//           <h2 className="mt-4 text-xl font-semibold text-black">
//             Update Profile
//           </h2>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="mt-10 space-y-6">

//           {/* Name */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400">Full Name</label>
//             <input
//               type="text"
//               required
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full text-sm outline-none"
//             />
//           </div>

//           {/* Email */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full text-sm outline-none"
//             />
//           </div>

//           {/* Phone */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400">Phone</label>
//             <div className="flex gap-2 items-center">
//               <Phone size={16} />
//               <input value={phoneNumber} disabled className="w-full text-sm" />
//             </div>
//           </div>

//           {/* Gender */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400">Gender</label>

//             <button
//               type="button"
//               onClick={() => setGenderOpen(!genderOpen)}
//               className="w-full flex justify-between"
//             >
//               {gender || "Select Gender"}
//               <ChevronDown size={16} />
//             </button>

//             {genderOpen && (
//               <div className="border mt-2 rounded">
//                 {["male", "female", "other"].map((g) => (
//                   <div
//                     key={g}
//                     onClick={() => {
//                       setGender(g);
//                       setGenderOpen(false);
//                     }}
//                     className="p-2 cursor-pointer hover:bg-gray-100"
//                   >
//                     {g}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* DOB */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400">DOB</label>
//             <input
//               type="date"
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               className="w-full text-sm"
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-green-600 text-white w-full py-3 rounded-xl"
//           >
//             {loading ? "Saving..." : "Create Profile"}
//           </button>
//         </form>

//         {/* ✅ Success Toast */}
//         {success && (
//           <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded shadow">
//             Profile updated successfully ✅
//           </div>
//         )}
//       </div>
//     </div>
//   );
// } 


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// import {
//   ChevronLeft,
//   ChevronDown,
//   Phone,
//   Camera,
// } from "lucide-react";

// export default function Profile() {
//   const router = useRouter();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [gender, setGender] = useState("");
//   const [dob, setDob] = useState("");
//   const phoneNumber = "12345******";
//   const [genderOpen, setGenderOpen] = useState(false);

//   const handleSubmit = () => {
//     if (!fullName || !email || !gender || !dob) {
//       alert("Please fill all fields before continuing.");
//       return;
//     }
//     // Save to localStorage so CRM chat can check it
//     localStorage.setItem(
//       "userProfile",
//       JSON.stringify({ fullName, email, gender, dob, phone: phoneNumber })
//     );
//     router.push("/support"); // go to chat page
//   };

//   return (
//     <div className="min-h-screen bg-white flex justify-center">
//       <div className="w-full max-w-sm px-5 py-4">

//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <button
//             onClick={() => router.push("/user-panel")}
//             className="w-8 h-8 rounded-full border flex items-center justify-center"
//             aria-label="Back to user panel"
//           >
//             <ChevronLeft size={18} />
//           </button>
//         </div>

//         {/* Profile Section */}
//         <div className="flex flex-col items-center">
//           <div className="relative">
//             <div className="w-24 h-24 rounded-full border-4 border-green-600 overflow-hidden">
//               <Image
//                 src="/profile.png"
//                 alt="profile"
//                 width={100}
//                 height={100}
//                 className="object-cover w-full h-full"
//               />
//             </div>
//             <button className="absolute bottom-1 right-0 bg-green-600 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
//               <Camera size={14} className="text-white" />
//             </button>
//           </div>

//           <h2 className="mt-4 text-xl font-semibold text-black">
//             Update Profile
//           </h2>
//           <p className="text-sm text-gray-400 mt-1">
//             Complete your details
//           </p>
//         </div>

//         {/* Form */}
//         <div className="mt-10 space-y-6">

//           {/* Full Name */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">
//               Full Name
//             </label>
//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Enter full name"
//               className="w-full text-sm text-black outline-none bg-transparent"
//             />
//           </div>

//           {/* Email */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">
//               Email Address
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email"
//               className="w-full text-sm text-black outline-none bg-transparent"
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">
//               Phone Number
//             </label>
//             <div className="flex items-center gap-3">
//               <Phone size={18} className="text-black" />
//               <input
//                 type="text"
//                 value={phoneNumber}
//                 disabled
//                 className="w-full text-sm text-gray-500 bg-transparent outline-none cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Gender */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">
//               Gender
//             </label>
//             <div className="relative w-full">
//               <button
//                 type="button"
//                 onClick={() => setGenderOpen((open) => !open)}
//                 className="w-full text-sm text-black bg-transparent outline-none flex items-center justify-between"
//               >
//                 <span className={gender ? "text-black" : "text-gray-400"}>
//                   {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Select Gender"}
//                 </span>
//                 <ChevronDown size={18} className="text-gray-500 shrink-0" />
//               </button>

//               {genderOpen && (
//                 <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
//                   {["Male", "Female", "Other"].map((option) => (
//                     <button
//                       key={option}
//                       type="button"
//                       className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
//                       onClick={() => {
//                         setGender(option.toLowerCase());
//                         setGenderOpen(false);
//                       }}
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* DOB */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">
//               Date of Birth
//             </label>
//             <input
//               type="date"
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               className="w-full text-sm text-black bg-transparent outline-none"
//             />
//           </div>
//         </div>

//         {/* Button */}
//         <div className="mt-14 flex justify-center">
//           <button
//             onClick={handleSubmit}
//             className="bg-green-600 hover:bg-green-700 transition-all text-white px-10 py-3 rounded-xl font-medium w-full"
//           >
//             Create Profile
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }






// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// import {
//   ChevronLeft,
//   ChevronDown,
//   Phone,
//   Camera,
//   CheckCircle,
// } from "lucide-react";

// export default function Profile() {
//   const router = useRouter();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [gender, setGender] = useState("");
//   const [dob, setDob] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [genderOpen, setGenderOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showToast, setShowToast] = useState(false);

//   // ✅ Get phone from localStorage on mount
//   useEffect(() => {
//     const phone = localStorage.getItem("phone");
//     if (phone) setPhoneNumber(phone);
//   }, []);

//   const handleSubmit = async () => {
//     if (!fullName || !email) {
//       alert("Please fill all fields before continuing.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("full_name", fullName);
//       formData.append("email", email);
//       formData.append("gender", gender);
//       formData.append("dob", dob);

//       const response = await fetch("/api/user/edit-profile", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.status === "success") {
//         // Save to localStorage
//         localStorage.setItem(
//           "userProfile",
//           JSON.stringify({ fullName, email, gender, dob, phone: phoneNumber })
//         );

//         // Show toast
//         setShowToast(true);

//         // Redirect after 2 seconds
//         setTimeout(() => {
//           router.push("/user-panel");
//         }, 2000);
//       } else {
//         alert(data.message || "Failed to update profile. Please try again.");
//       }
//     } catch {
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex justify-center">
//       <div className="w-full max-w-sm px-5 py-4">

//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <button
//             onClick={() => router.push("/user-panel")}
//             className="w-8 h-8 rounded-full border flex items-center justify-center"
//             aria-label="Back to user panel"
//           >
//             <ChevronLeft size={18} />
//           </button>
//         </div>

//         {/* Profile Section */}
//         <div className="flex flex-col items-center">
//           <div className="relative">
//             <div className="w-24 h-24 rounded-full border-4 border-green-600 overflow-hidden">
//               <Image
//                 src="/profile.png"
//                 alt="profile"
//                 width={100}
//                 height={100}
//                 className="object-cover w-full h-full"
//               />
//             </div>
//             <button className="absolute bottom-1 right-0 bg-green-600 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
//               <Camera size={14} className="text-white" />
//             </button>
//           </div>

//           <h2 className="mt-4 text-xl font-semibold text-black">
//             Update Profile
//           </h2>
//           <p className="text-sm text-gray-400 mt-1">
//             Complete your details
//           </p>
//         </div>

//         {/* Form */}
//         <div className="mt-10 space-y-6">

//           {/* Full Name */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">Full Name</label>
//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Enter full name"
//               className="w-full text-sm text-black outline-none bg-transparent"
//             />
//           </div>

//           {/* Email */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email"
//               className="w-full text-sm text-black outline-none bg-transparent"
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">Phone Number</label>
//             <div className="flex items-center gap-3">
//               <Phone size={18} className="text-black" />
//               <input
//                 type="text"
//                 value={phoneNumber}
//                 disabled
//                 placeholder="Loading..."
//                 className="w-full text-sm text-gray-500 bg-transparent outline-none cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Gender */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">Gender</label>
//             <div className="relative w-full">
//               <button
//                 type="button"
//                 onClick={() => setGenderOpen((open) => !open)}
//                 className="w-full text-sm text-black bg-transparent outline-none flex items-center justify-between"
//               >
//                 <span className={gender ? "text-black" : "text-gray-400"}>
//                   {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Select Gender"}
//                 </span>
//                 <ChevronDown size={18} className="text-gray-500 shrink-0" />
//               </button>

//               {genderOpen && (
//                 <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
//                   {["Male", "Female", "Other"].map((option) => (
//                     <button
//                       key={option}
//                       type="button"
//                       className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
//                       onClick={() => {
//                         setGender(option.toLowerCase());
//                         setGenderOpen(false);
//                       }}
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* DOB */}
//           <div className="border-b pb-3">
//             <label className="text-xs text-gray-400 mb-2 block">Date of Birth</label>
//             <input
//               type="date"
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               className="w-full text-sm text-black bg-transparent outline-none"
//             />
//           </div>
//         </div>

//         {/* Button */}
//         <div className="mt-14 flex justify-center">
//           <button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="bg-green-600 hover:bg-green-700 transition-all text-white px-10 py-3 rounded-xl font-medium w-full disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Saving..." : "Create Profile"}
//           </button>
//         </div>

//       </div>

//       {/* ✅ Success Toast */}
//       {showToast && (
//         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl animate-fade-in-up">
//           <CheckCircle size={20} className="text-green-400 shrink-0" />
//           <span className="text-sm font-medium">Profile updated successfully!</span>
//         </div>
//       )}

//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Get phone from localStorage on mount
  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (phone) setPhoneNumber(phone);
  }, []);

  // ✅ Strict client-side validation — prevents empty data reaching backend
  const validate = () => {
    const newErrors = {};

    if (!fullName.trim())
      newErrors.fullName = "Full name is required";
    else if (fullName.trim().length < 2)
      newErrors.fullName = "Name must be at least 2 characters";

    if (!email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Enter a valid email address";

    if (!gender)
      newErrors.gender = "Please select a gender";

    if (!dob)
      newErrors.dob = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = valid
  };

  const handleSubmit = async () => {
    // 🛡️ Block API call if any field is invalid
    if (!validate()) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phoneNumber )
      formData.append("gender", gender);
      formData.append("dob", dob);

      const response = await fetch("/api/user/edit-profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
    
      if (data.status === "success") {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({ fullName: fullName.trim(), email: email.trim(), gender, dob, phone: phoneNumber })
        );

        setShowToast(true);

        setTimeout(() => {
          router.push("/user-panel");
        }, 2000);
      } else {
        alert(data.message || "Failed to update profile. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <label className="text-xs text-gray-400 mb-2 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" }));
              }}
              placeholder="Enter full name"
              className="w-full text-sm text-black outline-none bg-transparent"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="border-b pb-3">
            <label className="text-xs text-gray-400 mb-2 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: "" }));
              }}
              placeholder="Enter email"
              className="w-full text-sm text-black outline-none bg-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="border-b pb-3">
            <label className="text-xs text-gray-400 mb-2 block">Phone Number</label>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-black" />
              <input
                type="text"
                value={phoneNumber}
                disabled
                placeholder="Loading..."
                className="w-full text-sm text-gray-500 bg-transparent outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="border-b pb-3">
            <label className="text-xs text-gray-400 mb-2 block">Gender</label>
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  setGenderOpen((open) => !open);
                  if (errors.gender) setErrors((p) => ({ ...p, gender: "" }));
                }}
                className="w-full text-sm text-black bg-transparent outline-none flex items-center justify-between"
              >
                <span className={gender ? "text-black" : "text-gray-400"}>
                  {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Select Gender"}
                </span>
                <ChevronDown size={18} className="text-gray-500 shrink-0" />
              </button>

              {genderOpen && (
                <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
                  {["Male", "Female", "Other"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
                      onClick={() => {
                        setGender(option.toLowerCase());
                        setGenderOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div className="border-b pb-3">
            <label className="text-xs text-gray-400 mb-2 block">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                if (errors.dob) setErrors((p) => ({ ...p, dob: "" }));
              }}
              className="w-full text-sm text-black bg-transparent outline-none"
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 transition-all text-white px-10 py-3 rounded-xl font-medium w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Create Profile"}
          </button>
        </div>

      </div>

      {/* ✅ Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl animate-fade-in-up">
          <CheckCircle size={20} className="text-green-400 shrink-0" />
          <span className="text-sm font-medium">Profile updated successfully!</span>
        </div>
      )}

    </div>
  );
}