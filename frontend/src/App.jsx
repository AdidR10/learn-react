import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import { tasksLoaded, taskAdded, taskUpdated, taskDeleted, tasksCleared } from './store/tasksSlice';
import { showNotification } from './store/uiSlice';

import Column from './components/Column';
import Login from './components/Login';
import Notification from './components/Notification';

const API_URL = 'http://localhost:3000/api/tasks';

export default function App() {
  // --- REDUX: Read state from the Global Store ---
  const { token, user } = useSelector((state) => state.auth);
  const tasks = useSelector((state) => state.tasks.items);

  // --- REDUX: Get the dispatch function to send actions ---
  const dispatch = useDispatch();

  // Local state for the inputs (we don't put this in Redux because no other component cares about what's temporarily in this text box)
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Fetch initial tasks
  useEffect(() => {
    if (!token) return;

    fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then(data => {
        // Dispatch the data to our Redux Store!
        dispatch(tasksLoaded(data));
      })
      .catch(err => {
        console.error(err);
        handleLogout(); 
      });
  }, [token, dispatch]); 

  // Handlers
  const handleLogout = () => {
    dispatch(logout()); // Log out in Redux
    dispatch(tasksCleared()); // Clear tasks in Redux
    dispatch(showNotification({ message: 'Logged out successfully.', type: 'success' }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault(); 
    if (newTaskTitle.trim() === '') return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: newTaskTitle, description: newTaskDesc })
      });
      
      if (res.ok) {
        const newTask = await res.json();
        // Send the new task to the Redux Store!
        dispatch(taskAdded(newTask));
        dispatch(showNotification({ message: 'Task Created!', type: 'success' }));
        setNewTaskTitle('');
        setNewTaskDesc('');
      } else {
        dispatch(showNotification({ message: 'Failed to create task.', type: 'error' }));
      }
    } catch (err) {
      dispatch(showNotification({ message: 'Network error.', type: 'error' }));
    }
  };

  const moveTask = async (taskId, newStatus) => {
    if (newStatus === 'Delete') {
      try {
        const res = await fetch(`${API_URL}/${taskId}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          // Tell Redux to delete it!
          dispatch(taskDeleted(taskId));
          dispatch(showNotification({ message: 'Task Deleted.', type: 'success' }));
        }
      } catch (err) {
        dispatch(showNotification({ message: 'Error deleting task.', type: 'error' }));
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/${taskId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        
        if (res.ok) {
          const updatedTask = await res.json();
          // Tell Redux to update the task status!
          dispatch(taskUpdated({ id: updatedTask.id, status: updatedTask.status }));
        }
      } catch (err) {
        dispatch(showNotification({ message: 'Error updating task status.', type: 'error' }));
      }
    }
  };

  // Conditional Rendering
  if (!token) {
    return (
      <>
        <Notification />
        <Login />
      </>
    );
  }

  return (
    <div>
      <Notification />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Task Board (Redux Powered)</h1>
        <div>
          <span>Welcome, <strong>{user}</strong>! </span>
          <button onClick={handleLogout} style={{ padding: '4px 8px', cursor: 'pointer' }}>Log Out</button>
        </div>
      </div>
      
      <form onSubmit={handleCreateTask} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="text" 
          placeholder="Description (Optional)"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      <div className="board">
        <Column 
          title="To Do" 
          tasks={tasks.filter((t) => t.status === 'To Do')} 
          moveTask={moveTask}
        />
        <Column 
          title="In Progress" 
          tasks={tasks.filter((t) => t.status === 'In Progress')} 
          moveTask={moveTask}
        />
        <Column 
          title="Done" 
          tasks={tasks.filter((t) => t.status === 'Done')} 
          moveTask={moveTask}
        />
      </div>
    </div>
  )
}
