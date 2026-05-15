import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMessagesFromApi } from '../utils/chatMessageApi';

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
      });
  },
});

export const { togglePremium, setActiveTab } = chatSlice.actions;
export default chatSlice.reducer;