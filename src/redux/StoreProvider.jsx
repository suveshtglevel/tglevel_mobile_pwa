'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { store } from './store';
import { setLoading, updateProfile } from './userSlice';

function formatDisplayName(user = {}) {
  const firstName = (user.first_name || '').trim();
  const lastName = (user.last_name || '').trim();
  const combined = `${firstName} ${lastName}`.trim();
  return combined || (user.name || '').trim() || 'Guest User';
}

function normalizeTrialPayload(data) {
  return {
    name: formatDisplayName(data.user || {}),
    email: data.user?.email || '',
    phone: data.user?.phone || '',
    gender: data.user?.gender || '',
    dob: data.user?.dob || '',
    avatar: data.user?.image || data.user?.avatar || '',
    userType: data.is_active ? 'premium' : 'free',
    daysLeft: typeof data.days_left === 'number' ? data.days_left : 0,
    expiryDate: data.expiry_date || '',
    expiryDateUi: data.expiry_date_ui || '',
    isActive: Boolean(data.is_active),
  };
}

function BootstrapTrialState() {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const hydrateFromCache = () => {
      try {
        const cachedProfileRaw = localStorage.getItem('userProfile');
        const cachedExpiryRaw = localStorage.getItem('trialExpiry');
        if (!cachedProfileRaw && !cachedExpiryRaw) return false;

        const cachedProfile = cachedProfileRaw ? JSON.parse(cachedProfileRaw) : {};
        const cachedExpiry = cachedExpiryRaw ? JSON.parse(cachedExpiryRaw) : {};

        dispatch(updateProfile({
          name: cachedProfile.fullName || cachedProfile.name || 'Guest User',
          email: cachedProfile.email || '',
          gender: cachedProfile.gender || '',
          dob: cachedProfile.dob || '',
          phone: cachedProfile.phone || '',
          avatar: cachedProfile.avatar || '',
          userType: cachedExpiry.isActive ? 'premium' : 'free',
          daysLeft: typeof cachedExpiry.daysLeft === 'number' ? cachedExpiry.daysLeft : 0,
          expiryDate: cachedExpiry.expiryDate || '',
          expiryDateUi: cachedExpiry.expiryDateUi || '',
          isActive: Boolean(cachedExpiry.isActive),
          isNewUser: cachedProfile.isNewUser ?? true,
        }));

        return true;
      } catch {
        return false;
      }
    };

    const loadTrialState = async () => {
      const hasCache = hydrateFromCache();
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        dispatch(setLoading(false));
        return;
      }

      if (!hasCache) {
        dispatch(setLoading(true));
      }

      try {
        const response = await fetch(`/api/profile?user_id=${encodeURIComponent(userId)}`, {
          credentials: 'include',
        });

        const data = await response.json();
        if (cancelled) return;

        if (response.ok && data.status === 'success') {
          const nextProfile = normalizeTrialPayload(data);

          dispatch(updateProfile(nextProfile));

          localStorage.setItem('trialExpiry', JSON.stringify({
            expiryDate: nextProfile.expiryDate,
            expiryDateUi: nextProfile.expiryDateUi,
            daysLeft: nextProfile.daysLeft,
            isActive: nextProfile.isActive,
          }));

          const cachedProfile = {
            fullName: nextProfile.name,
            email: nextProfile.email,
            gender: nextProfile.gender,
            dob: nextProfile.dob,
            phone: nextProfile.phone,
            avatar: nextProfile.avatar,
            isNewUser: localStorage.getItem('isNewUser') === 'true',
          };
          localStorage.setItem('userProfile', JSON.stringify(cachedProfile));
        } else {
          dispatch(setLoading(false));
        }
      } catch {
        if (!hasCache && !cancelled) {
          dispatch(setLoading(false));
        }
      }
    };

    loadTrialState();

    const handleSessionChange = () => {
      loadTrialState();
    };

    window.addEventListener('trial-session-changed', handleSessionChange);
    window.addEventListener('storage', handleSessionChange);

    return () => {
      cancelled = true;
      window.removeEventListener('trial-session-changed', handleSessionChange);
      window.removeEventListener('storage', handleSessionChange);
    };
  }, [dispatch]);

  return null;
}

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <BootstrapTrialState />
      {children}
    </Provider>
  );
}