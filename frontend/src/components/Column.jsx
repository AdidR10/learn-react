import TaskCard from './TaskCard';

export default function Column({ title, tasks, moveTask }) {
  return (
    <div className="column">
      <h2>{title} ({tasks.length})</h2>
      
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          id={task.id}
          title={task.title} 
          description={task.description} 
          status={task.status}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
}
