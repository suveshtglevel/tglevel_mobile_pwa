'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterScreen } from '../components/RegisterScreen';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = () => {
      let userId = localStorage.getItem('user_id');
      const isNewUser = localStorage.getItem('isNewUser');
      const termsAccepted = localStorage.getItem('terms_accepted');

      // Normalize possible bad values. localStorage stores everything as strings;
      // sometimes code may accidentally write undefined/null which become the
      // strings "undefined"/"null" (truthy). Treat those as missing.
      if (userId === 'undefined' || userId === 'null' || userId === '') {
        userId = null;
      }

      if (userId) {
        if (isNewUser === 'true' && termsAccepted !== 'true') {
          router.replace('/terms-condition');
        } else {
          router.replace('/chat');
        }
        return;
      }

      // not logged in — allow render of RegisterScreen
      // defer state update to next tick to avoid cascading render warnings in strict mode
      if (!mounted) return;
      const id = setTimeout(() => {
        if (mounted) setCheckingAuth(false);
      }, 0);
      return () => clearTimeout(id);
    };

    const cleanup = check();
    return () => {
      mounted = false;
      if (typeof cleanup === 'function') cleanup();
    };
  }, [router]);

  if (checkingAuth) return null; // or a small splash component

  return <RegisterScreen />;
}