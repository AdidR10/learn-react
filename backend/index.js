const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Added jsonwebtoken

const app = express();
const PORT = process.env.PORT || 3000;

// A secret key used to sign and verify our JWTs.
// In a real app, this MUST be in a .env file and never committed to code!
const SECRET_KEY = 'lab3_super_secret_training_key';

app.use(cors()); 
app.use(express.json());

let tasks = [
  { id: 1, title: 'Learn JSX', description: 'Write some HTML in JS', status: 'To Do' },
  { id: 2, title: 'Learn Props', description: 'Pass data down', status: 'In Progress' },
  { id: 3, title: 'Learn State', description: 'Make it interactive', status: 'Done' },
];

app.get('/', (req, res) => {
  res.send('Task Board API is running!');
});

// --- NEW: Phase 3 Authentication ---

// 1. Mock Login Endpoint
// Accepts standard username/password and returning a JWT if successful
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded check for training purposes
  if (username === 'admin' && password === 'lab3') {
    // Generate the JWT tokens
    // The payload (first arg) is the data we want to encode into the token
    const token = jwt.sign(
      { id: 1, username: 'admin', role: 'developer' }, 
      SECRET_KEY, 
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    
    // Return the token to the frontend so it can save it
    return res.json({ token, username });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
});

// 2. Authentication Middleware
// This function intercepts requests BEFORE they reach the task endpoints
const authenticateToken = (req, res, next) => {
  // Tokens usually come in the "Authorization" header formatted as: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  // Verify the token using our secret key
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    
    // Attach the decoded user data to the request so the endpoint can use it!
    req.user = user; 
    
    next(); // Pass control to the next function (the actual endpoint)
  });
};

// --- Protected Endpoints ---
// Notice how we inserted `authenticateToken` as the second argument to all these routes!

// GET /api/tasks - Retrieve all tasks (Protected)
app.get('/api/tasks', authenticateToken, (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - Create a new task (Protected)
app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: Date.now(),
    title,
    description: description || '',
    status: 'To Do',
    // We can even record WHO created the task since req.user contains the decoded token!
    createdBy: req.user.username 
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task (Protected)
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { status, title, description } = req.body;

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (status !== undefined) tasks[taskIndex].status = status;
  if (title !== undefined) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;

  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete a task (Protected)
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
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
