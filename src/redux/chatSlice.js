import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMessagesFromApi } from '../utils/chatMessageApi';

// Initial Tab Load (Page 1)
export const fetchInitialMessages = createAsyncThunk(
  'chat/fetchInitialMessages',
  async (category) => {
    // page 1, limit 10
    const response = await fetchMessagesFromApi(category, 1, 10);
    return response; // { data: [...], hasMore: boolean }
  }
);

// Scroll up Load (Page 2, 3, etc.)
export const fetchOlderMessages = createAsyncThunk(
  'chat/fetchOlderMessages',
  async ({ category, page }) => {
    const response = await fetchMessagesFromApi(category, page, 10);
    return response; 
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isPremium: false,
    activeTab: 'All',
    messagesData: [],
    
    // Pagination states
    currentPage: 1,
    hasMore: true,
    isLoading: false,       // For first load
    isFetchingOlder: false, // For scrolling up
    error: null,
  },
  reducers: {
    togglePremium: (state) => {
      state.isPremium = !state.isPremium;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- INITIAL LOAD CASES ---
      .addCase(fetchInitialMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInitialMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messagesData = action.payload.data; // Page 1 data
        state.hasMore = action.payload.hasMore;
        state.currentPage = 1;
      })
      .addCase(fetchInitialMessages.rejected, (state, action) => {
        if (action.meta.aborted || action.error.message === 'Aborted') return;
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load messages';
      })
      
      // --- OLDER LOAD CASES (Scroll Up) ---
      .addCase(fetchOlderMessages.pending, (state) => {
        state.isFetchingOlder = true;
      })
      .addCase(fetchOlderMessages.fulfilled, (state, action) => {
        state.isFetchingOlder = false;
        // Adding older messages to existing messages
        state.messagesData = [...action.payload.data, ...state.messagesData];
        state.hasMore = action.payload.hasMore;
        state.currentPage += 1; // increse the Page number
      })
      .addCase(fetchOlderMessages.rejected, (state, action) => {
        if (action.meta.aborted || action.error.message === 'Aborted') return;
        state.isFetchingOlder = false;
      });
  },
});

export const { togglePremium, setActiveTab } = chatSlice.actions;
export default chatSlice.reducer;