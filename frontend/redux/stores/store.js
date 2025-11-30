
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import messagesReducer from '../slices/messagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
  }
})
