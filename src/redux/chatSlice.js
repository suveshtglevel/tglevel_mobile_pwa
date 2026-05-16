// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchMessagesFromApi } from '../utils/chatMessageApi';

// export const fetchInitialMessages = createAsyncThunk(
//   'chat/fetchInitialMessages',
//   async (category, { rejectWithValue }) => {
//     try {
//       const response = await fetchMessagesFromApi(category);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState: {
//     isPremium: false,
//     activeTab: 'NFT',
//     messagesData: [],
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     togglePremium: (state) => {
//       state.isPremium = !state.isPremium;
//     },
//     setActiveTab: (state, action) => {
//       state.activeTab = action.payload;
//       state.messagesData = [];
//       state.error = null;
//       state.isLoading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchInitialMessages.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         state.messagesData = [];
//       })
//       .addCase(fetchInitialMessages.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.messagesData = action.payload.data;
//       })
//       .addCase(fetchInitialMessages.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Failed to load messages';
//       });
//   },
// });

// export const { togglePremium, setActiveTab } = chatSlice.actions;
// export default chatSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMessagesFromApi, fetchNewMessagesFromApi } from '../utils/chatMessageApi';

// Initial load — today's messages
export const fetchInitialMessages = createAsyncThunk(
  'chat/fetchInitialMessages',
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetchMessagesFromApi(category);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Polling — new messages after last id (every 1 sec)
export const fetchNewMessages = createAsyncThunk(
  'chat/fetchNewMessages',
  async ({ category, afterId }, { rejectWithValue }) => {
    try {
      const response = await fetchNewMessagesFromApi(category, afterId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isPremium: false,
    activeTab: 'NFT',
    messagesData: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    togglePremium: (state) => {
      state.isPremium = !state.isPremium;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.messagesData = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial load
      .addCase(fetchInitialMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.messagesData = [];
      })
      .addCase(fetchInitialMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messagesData = action.payload.data;
      })
      .addCase(fetchInitialMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load messages';
      })

      // Polling — append new messages to bottom
      
      
      // Poll — append only truly new messages
    .addCase(fetchNewMessages.fulfilled, (state, action) => {
    const newMsgs = action.payload.data;
    if (newMsgs.length > 0) {
    const existingIds = new Set(state.messagesData.map((m) => m.id));
    const unique = newMsgs.filter((m) => !existingIds.has(m.id));
    if (unique.length > 0) {
      state.messagesData = [...state.messagesData, ...unique];
    }
  }
});
  },
});

export const { togglePremium, setActiveTab } = chatSlice.actions;
export default chatSlice.reducer;