import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:null,
    token:''
  },
  reducers: { 
    loginUser:(state,action) => {
        state.user = action.payload.user;
        state.token = action.payload.access_token;
    },
    logoutUser:(state,action) => {
        state.user = null;
        state.token = '';
    },
    restoreUser:(state,action) => {
        state.user = action.payload.user;
        state.token = action.payload.access_token;
    },
    updateUser:(state,action) => {
      state.user = {...state.user,...action.payload}
    }
  },
});

export const { loginUser,logoutUser,restoreUser } = authSlice.actions;
export default authSlice.reducer;