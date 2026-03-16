import { useState, useEffect } from 'react';
import Column from './components/Column';
import Login from './components/Login'; // Import our new Login screen

const API_URL = 'http://localhost:3000/api/tasks';

export default function App() {
  // --- NEW: Authentication State ---
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // We only fetch tasks if we HAVE a token!
  useEffect(() => {
    if (!token) return;

    fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}` // Here is where we attach the JWT to prove who we are!
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch (maybe token expired?)');
        return res.json();
      })
      .then(data => setTasks(data))
      .catch(err => {
        console.error(err);
        handleLogout(); // Force logout if token is bad
      });
  }, [token]); // This effect now runs whenever the 'token' changes!

  // --- Login & Logout Handlers ---
  const handleLoginSuccess = (jwtToken, username) => {
    setToken(jwtToken);
    setUser(username);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setTasks([]); // Clear data on logout
  };

  const handleCreateTask = async (e) => {
    e.preventDefault(); 
    if (newTaskTitle.trim() === '') return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Attach token!
        },
        body: JSON.stringify({ title: newTaskTitle, description: newTaskDesc })
      });
      
      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDesc('');
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const moveTask = async (taskId, newStatus) => {
    if (newStatus === 'Delete') {
      try {
        const res = await fetch(`${API_URL}/${taskId}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` } // Attach token!
        });
        if (res.ok) setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/${taskId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Attach token!
          },
          body: JSON.stringify({ status: newStatus })
        });
        
        if (res.ok) {
          const updatedTask = await res.json();
          setTasks(tasks.map(task => 
            task.id === taskId ? updatedTask : task
          ));
        }
      } catch (err) {
        console.error("Error updating task status:", err);
      }
    }
  };

  // --- Conditional Rendering based on Auth State ---
  
  // If we don't have a token, show ONLY the login screen!
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // If we DO have a token, show the main application board!
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Task Board</h1>
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
