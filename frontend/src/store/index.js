import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tasksReducer from './tasksSlice';
import uiReducer from './uiSlice';

// 6. The "Store" combines all our "Slices" into one giant state object.
export const store = configureStore({
  reducer: {
    auth: authReducer,   // Accessible via state.auth.token
    tasks: tasksReducer, // Accessible via state.tasks.items
    ui: uiReducer        // Accessible via state.ui.notification
  }
});
