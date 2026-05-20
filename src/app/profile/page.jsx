"use client";

import { Suspense } from "react";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile />
    </Suspense>
  );
}