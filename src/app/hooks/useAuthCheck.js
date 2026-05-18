"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthCheck(redirectTo = "/register") {
  const router = useRouter();

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    const userId = localStorage.getItem("user_id");

    // If data missing from localStorage but ci_session cookie exists
    // → user is logged in but localStorage was cleared
    // → restore by calling your profile API
    if (!phone || !userId) {
      fetch("/api/user/me")  // create this endpoint
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            localStorage.setItem("phone", data.phone);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("userProfile", JSON.stringify({
              fullName: data.name,
              email: data.email,
              gender: data.gender,
              dob: data.dob,
              phone: data.phone,
            }));
          } else {
            router.push(redirectTo);
          }
        })
        .catch(() => router.push(redirectTo));
    }
  }, []);
}