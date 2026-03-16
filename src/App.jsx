import { useState, useEffect } from 'react';
import Column from './components/Column';

const API_URL = 'http://localhost:3000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  // Create a new task via API
  const handleCreateTask = async (e) => {
    e.preventDefault(); 
    if (newTaskTitle.trim() === '') return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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

  // Move or delete a task via API
  const moveTask = async (taskId, newStatus) => {
    if (newStatus === 'Delete') {
      try {
        const res = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
        if (res.ok) setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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

  return (
    <div>
      <h1>My Task Board</h1>
      
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
