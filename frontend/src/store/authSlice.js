import { createSlice } from '@reduxjs/toolkit';

// 1. Initial State: What does this piece of data look like when the app starts?
const initialState = {
  token: null,
  user: null,
};

// 2. The Slice: This combines the "Store" and "Reducers" into one simple file
const authSlice = createSlice({
  name: 'auth', // The name of this slice (shows up in Redux DevTools)
  initialState,
  reducers: {
    // 3. The Reducers/Actions: These are the ONLY ways to change the state
    loginSuccess: (state, action) => {
      // action.payload will contain our { token, username }
      state.token = action.payload.token;
      state.user = action.payload.username;
      // Note: In standard Redux, you CANNOT mutate state like `state.token = ...`
      // But Redux Toolkit uses a library called Immer under the hood that allows this!
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    }
  }
});

// 4. Export the ACTIONS (so we can dispatch them from Login.jsx or App.jsx)
export const { loginSuccess, logout } = authSlice.actions;

// 5. Export the REDUCER (so we can add it to the global store)
export default authSlice.reducer;
