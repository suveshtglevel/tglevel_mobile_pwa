'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterScreen } from '../components/RegisterScreen';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const isNewUser = localStorage.getItem('isNewUser');
    const termsAccepted = localStorage.getItem('terms_accepted');

    if (userId) {
      if (isNewUser === 'true' && termsAccepted !== 'true') {
        router.replace('/terms-condition');
      } else {
        router.replace('/chat');
      }
    }
    // no userId = stay on register page (RegisterScreen shows below)
  }, [router]);

  return <RegisterScreen />;
}
