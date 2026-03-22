import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // This will hold our list of tasks
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // We will dispatch this when the initial `fetch` is complete
    tasksLoaded: (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },
    taskAdded: (state, action) => {
      state.items.push(action.payload);
    },
    taskUpdated: (state, action) => {
      const { id, status } = action.payload; // E.g. { id: 1, status: 'Done' }
      const existingTask = state.items.find(task => task.id === id);
      if (existingTask) {
        existingTask.status = status;
      }
    },
    taskDeleted: (state, action) => {
      const taskId = action.payload;
      state.items = state.items.filter(task => task.id !== taskId);
    },
    tasksCleared: (state) => {
      state.items = []; // Cleared on logout
    }
  }
});

export const { tasksLoaded, taskAdded, taskUpdated, taskDeleted, tasksCleared } = tasksSlice.actions;
export default tasksSlice.reducer;
