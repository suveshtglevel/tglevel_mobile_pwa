import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMessagesFromApi, fetchOlderMessagesFromApi } from '../utils/chatMessageApi';

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

export const fetchOlderMessages = createAsyncThunk(
  'chat/fetchOlderMessages',
  async (category, { getState, rejectWithValue }) => {
    try {
      const messagesData = getState().chat.messagesData;
      const oldestMessage = messagesData[0];

      if (!oldestMessage?.id) {
        return { data: [], hasMore: false };
      }

      return await fetchOlderMessagesFromApi(category, oldestMessage.id);
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
    isLoadingMore: false,
    hasMoreOlder: true,
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
      state.isLoadingMore = false;
      state.hasMoreOlder = true;
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

    builder
      .addCase(fetchOlderMessages.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(fetchOlderMessages.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.messagesData = [...action.payload.data, ...state.messagesData];
        state.hasMoreOlder = action.payload.hasMore;
      })
      .addCase(fetchOlderMessages.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload || 'Failed to load older messages';
      });
  },
});

export const { togglePremium, setActiveTab } = chatSlice.actions;
export default chatSlice.reducer;