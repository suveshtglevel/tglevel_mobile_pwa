import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {
    name: "Guest User",
    email: "",
    gender: "",
    dob: "",
    avatar: "",
    userType: "free",
    daysLeft: 5,
    expiryDate: "",
    expiryDateUi: "",
    isActive: false,
    isNewUser: true,
    hasCompletedOnboarding: false,
  },
  unreadNotifications: 0,
  isLoading: true, // 🟢 FIX: Shuru mein isko true rakhenge
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const nextUserData = { ...state.userData, ...action.payload };
      if (typeof action.payload?.isActive === 'boolean') {
        nextUserData.userType = action.payload.isActive ? 'premium' : 'free';
      }
      if (typeof action.payload?.days_left === 'number' && nextUserData.daysLeft == null) {
        nextUserData.daysLeft = action.payload.days_left;
      }
      state.userData = nextUserData;
      state.isLoading = false; // 🟢 FIX: Data aate hi loading ko false kar denge
    },
    toggleUserMode: (state) => {
      state.userData.userType = state.userData.userType === "premium" ? "free" : "premium";
    },
    clearNotifications: (state) => {
      state.unreadNotifications = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload; // 🟢 FIX: Loading control karne ke liye reducer
    }
  }
});

export const { updateProfile, toggleUserMode, clearNotifications, setLoading } = userSlice.actions;
export default userSlice.reducer;