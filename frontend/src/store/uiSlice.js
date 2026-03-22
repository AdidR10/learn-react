import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: null, 
  // Looks like: { message: "Task Deleted!", type: "error"|"success" }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type,
        id: Date.now() // Unique ID to force re-render if the same message is sent twice
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

export const { showNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
