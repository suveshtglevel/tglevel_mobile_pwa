"use client";
import { RegisterScreen } from "@/components/RegisterScreen";

export default function Home() {
  // The RegisterScreen now manages its own min-height; this wrapper just
  // ensures a white background fills the page on tablets/desktop.
  return (
    <div className="min-h-app w-full bg-white">
      <RegisterScreen />
    </div>
  );
}
