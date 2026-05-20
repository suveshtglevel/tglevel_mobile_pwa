"use client";

import { Suspense } from "react";
import TermsConditionPage from "../../components/TermsConditionPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TermsConditionPage />
    </Suspense>
  );
}