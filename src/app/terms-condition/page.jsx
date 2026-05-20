import { Suspense } from "react";
import TermsConditionPage from "../../components/TermsConditionPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TermsConditionPage />
    </Suspense>
  );
}