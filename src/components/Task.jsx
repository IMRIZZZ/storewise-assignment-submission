// Level 2: No useState, useReducer, or any hooks inside Task card.
// All data is passed as props from the parent.

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  'IN PROGRESS': '#3b82f6',
  COMPLETE: '#10b981',
};

const Task = ({ task, onOpen, onDelete }) => {
  const statusColor = STATUS_COLORS[task.status] || '#94a3b8';

  return (
    <div
      className="task-card"
      onClick={() => onOpen(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(task)}
      style={{ '--status-color': statusColor }}
    >
      <div className="task-card-header">
        <span className="task-name">{task.name}</span>
        <button
          className="task-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          title="Delete task"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
      <div className="task-status-badge" style={{ backgroundColor: statusColor }}>
        {task.status}
      </div>
    </div>
  );
};

export default Task;
