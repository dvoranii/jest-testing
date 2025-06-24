const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple CORS setup
app.use(cors());

// Middleware
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'tasks.json');

// Initialize with test data if file doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialTasks = [
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build a todo app', completed: false },
    { id: 3, title: 'Connect frontend to backend', completed: true }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialTasks, null, 2));
  console.log('Created initial tasks.json file');
}

// Helper functions
const getTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

// API Routes - using simpler route definitions
app.get('/api/tasks', (req, res) => {
  console.log('GET /api/tasks - Fetching all tasks');
  const tasks = getTasks();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  console.log('POST /api/tasks - Request body:', req.body);
  
  if (!req.body || !req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const tasks = getTasks();
  const newTask = {
    id: Math.max(0, ...tasks.map(t => t.id)) + 1,
    title: req.body.title.trim(),
    completed: false
  };
  
  tasks.push(newTask);
  
  if (saveTasks(tasks)) {
    console.log('Successfully added new task:', newTask);
    res.status(201).json(newTask);
  } else {
    res.status(500).json({ error: 'Failed to save task' });
  }
});

// Simple route handler for toggle
app.patch('/api/tasks/:id/toggle', (req, res) => {
  const taskId = parseInt(req.params.id);
  console.log(`PATCH /api/tasks/${taskId}/toggle - Toggling task`);
  
  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }
  
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  
  if (saveTasks(tasks)) {
    console.log('Successfully toggled task:', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Data file: ${DATA_FILE}`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/`);
});