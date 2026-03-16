import { useState } from 'react';

// 3. TaskCard receives the moveTask function (and the task's id and status!)
function TaskCard({ id, title, description, status, moveTask }) {
  return (
    <div className="task-card">
      <h3>{title}</h3>
      {description && <p style={{ marginBottom: '10px' }}>{description}</p>}

      {/* 4. We render different buttons based on what column the task is currently in! */}
      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
        {status === 'To Do' && (
          <button onClick={() => moveTask(id, 'In Progress')} style={btnStyle}>➔ In Progress</button>
        )}

        {status === 'In Progress' && (
          <>
            <button onClick={() => moveTask(id, 'To Do')} style={btnStyle}>⬅ To Do</button>
            <button onClick={() => moveTask(id, 'Done')} style={btnStyle}>➔ Done</button>
          </>
        )}

        {status === 'Done' && (
          <>
            <button onClick={() => moveTask(id, 'In Progress')} style={btnStyle}>⬅ In Progress</button>
            {/* Bonus: A delete button! */}
            <button onClick={() => moveTask(id, 'Delete')} style={{ ...btnStyle, backgroundColor: '#ffebe6', color: '#bf2600' }}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

// Just a small helper for our button CSS so we don't repeat it
const btnStyle = {
  padding: '4px 8px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '3px',
  backgroundColor: '#f4f5f7'
};

// 2. Column receives the moveTask function and passes it down to each TaskCard
function Column({ title, tasks, moveTask }) {
  return (
    <div className="column">
      <h2>{title} ({tasks.length})</h2>

      {/* 
        This is how we build a list in React. 
        It is like Flutter's `ListView.builder` or `.map().toList()`.
        We loop over the tasks array and return a TaskCard for each one!
      */}
      {tasks.map((task) => (
        // 'key' is required by React when making lists so it knows which item is which
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          status={task.status}
          moveTask={moveTask} // Pass it down again!
        />
      ))}
    </div>
  );
}

export default function App() {
  // We define our master list of tasks in the parent component.
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn JSX', description: 'Write some HTML in JS', status: 'To Do' },
    { id: 2, title: 'Learn Props', description: 'Pass data down', status: 'In Progress' },
    { id: 3, title: 'Learn State', description: 'Make it interactive', status: 'Done' },
  ]);

  // We need state to handle the "New Task" form inputs!
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // This function runs when the user submits the form
  const handleCreateTask = (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page

    if (newTaskTitle.trim() === '') return; // Don't add empty tasks!

    const newTask = {
      id: Date.now(), // Simple way to generate a unique ID
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'To Do', // Always starts in 'To Do'
    };

    // We CANNOT do `tasks.push(newTask)`. 
    // In React, state is immutable. We must create a NEW array with all the old tasks PLUS the new one.
    // The `...` is the "spread" operator. It means "expand the array here".
    setTasks([...tasks, newTask]);

    // Clear the form after saving
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  // 1. We create a function inside the parent that can modify its own state
  const moveTask = (taskId, newStatus) => {
    if (newStatus === 'Delete') {
      // If the status is Delete, we remove it from the array entirely
      setTasks(tasks.filter(task => task.id !== taskId));
    } else {
      // Otherwise, we map over the array and update only the task that was clicked
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    }
  };

  return (
    <div>
      <h1>My Task Board</h1>

      {/* Our New Task Form! */}
      <form
        onSubmit={handleCreateTask}
        style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}
      >
        {/* We "bind" the input value to our state, and update the state 'onChange' */}
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

        <button
          type="submit"
          style={{ padding: '8px 16px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Task
        </button>
      </form>


      {/* We use Flexbox in the '.board' CSS class to make this a horizontal row */}
      <div className="board">
        {/* Pass the moveTask function into each column via props! */}
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
