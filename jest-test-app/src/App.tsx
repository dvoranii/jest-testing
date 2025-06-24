import { AddTaskForm } from './components/AddTaskForm';
import { TaskList } from './components/TaskList';
import { APIStatus } from './components/APIStatus';
import { useTaskManager } from './hooks/useTaskManager';
import './App.css';

function App() {
  const { tasks, addTask, toggleTask, loading, error } = useTaskManager();

  return (
    <div className="app-container">
      <h1>Task Tracker</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <AddTaskForm onAddTask={addTask} />
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onToggleTask={toggleTask} 
        />
      )}
      
      <div className="api-status-container">
        <APIStatus />
      </div>
    </div>
  );
}

export default App;