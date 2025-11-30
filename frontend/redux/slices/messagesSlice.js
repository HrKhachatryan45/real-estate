import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversationsList:null,
    currentConversation:null,
    unreadCount:0
  },
  reducers: { 
    setConversations: (state, action) => {
      state.conversationsList = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload; 
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
    }
  },
});

export const { setConversations,setActiveConversation,clearActiveConversation } = messagesSlice.actions;
export default messagesSlice.reducer;