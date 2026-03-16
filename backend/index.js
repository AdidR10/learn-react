const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS allows our React frontend (running on a different port) to access this API
app.use(cors()); 
// This allows our server to read JSON sent in the request body (e.g. creating a task)
app.use(express.json());

// In-memory array to store our tasks temporarily while the server runs
let tasks = [
  { id: 1, title: 'Learn JSX', description: 'Write some HTML in JS', status: 'To Do' },
  { id: 2, title: 'Learn Props', description: 'Pass data down', status: 'In Progress' },
  { id: 3, title: 'Learn State', description: 'Make it interactive', status: 'Done' },
];

// Phase 1: Basic Server Test Route
app.get('/', (req, res) => {
  res.send('Task Board API is running!');
});

// GET /api/tasks - Retrieve all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: Date.now(),
    title,
    description: description || '',
    status: 'To Do',
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask); // 201 Created
});

// PUT /api/tasks/:id - Update a task (like moving its column)
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { status, title, description } = req.body;

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update fields if provided
  if (status !== undefined) tasks[taskIndex].status = status;
  if (title !== undefined) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;

  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json(deletedTask[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
