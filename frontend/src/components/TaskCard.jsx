export default function TaskCard({ id, title, description, status, moveTask }) {
  // Just a small helper for our button CSS so we don't repeat it
  const btnStyle = {
    padding: '4px 8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '3px',
    backgroundColor: '#f4f5f7'
  };

  return (
    <div className="task-card">
      <h3>{title}</h3>
      {description && <p style={{ marginBottom: '10px' }}>{description}</p>}
      
      {/* We render different buttons based on what column the task is currently in! */}
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
             {/* Delete button! */}
             <button onClick={() => moveTask(id, 'Delete')} style={{...btnStyle, backgroundColor: '#ffebe6', color: '#bf2600'}}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
