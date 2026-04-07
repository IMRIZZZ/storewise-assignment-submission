import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, TextInput, Button, Group, Text } from '@mantine/core';
import Task from './Task';
import TaskModal from './TaskModal';

const STATUSES = ['PENDING', 'IN PROGRESS', 'COMPLETE'];

const Board = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  const [createOpen, setCreateOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  const [selectedTask, setSelectedTask] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [cloneOpen, setCloneOpen] = useState(false);
  const cloneRef = useRef(null);

  const [headerDate, setHeaderDate] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetch('https://10000--main--fastapi--admin.dev.storewise.in/')
      .then((r) => r.json())
      .then((data) => {
        const d = data?.date || data?.current_date || null;
        setHeaderDate(d || getFallbackDate());
      })
      .catch(() => setHeaderDate(getFallbackDate()));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cloneRef.current && !cloneRef.current.contains(e.target)) {
        setCloneOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFallbackDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const createTask = () => {
    const name = newTaskName.trim();
    if (!name) return;
    dispatch({ type: 'ADD_TASK', payload: { id: Date.now(), name, status: 'PENDING' } });
    setNewTaskName('');
    setCreateOpen(false);
  };

  const cloneTask = (sourceId) => {
    dispatch({ type: 'CLONE_TASK', payload: { sourceId, newId: Date.now() } });
    setCloneOpen(false);
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    if (selectedTask?.id === id) {
      setDetailOpen(false);
      setSelectedTask(null);
    }
  };

  const updateTask = (updated) => {
    dispatch({ type: 'UPDATE_TASK', payload: updated });
    setSelectedTask(updated);
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const getSortedTasks = () => {
    if (sortBy === 'name') return [...tasks].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'status') return [...tasks].sort((a, b) => a.status.localeCompare(b.status));
    return tasks;
  };

  const sortedTasks = getSortedTasks();

  const statusGroups = {
    PENDING: sortedTasks.filter((t) => t.status === 'PENDING'),
    'IN PROGRESS': sortedTasks.filter((t) => t.status === 'IN PROGRESS'),
    COMPLETE: sortedTasks.filter((t) => t.status === 'COMPLETE'),
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="header-title">Board</h1>
          <span className="header-date">{headerDate}</span>
        </div>
        <div className="header-right">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="name">Sort: By Name</option>
            <option value="status">Sort: By Status</option>
          </select>
        </div>
      </header>

      {/* Global action bar — matches wireframe */}
      <div className="action-bar">
        <div className="action-bar-left">
          <span className="tasks-count-label">Tasks ({tasks.length})</span>
        </div>
        <div className="action-bar-right">
          {/* Single Clone Task button with dropdown */}
          <div className="clone-wrapper" ref={cloneRef}>
            <button
              className="btn btn-secondary"
              onClick={() => setCloneOpen((v) => !v)}
              disabled={tasks.length === 0}
            >
              Clone Task
            </button>
            {cloneOpen && tasks.length > 0 && (
              <div className="clone-dropdown">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="clone-option"
                    onClick={() => cloneTask(t.id)}
                  >
                    <span className="clone-option-name">{t.name}</span>
                    <span className={`clone-option-status status-dot-${t.status.replace(' ', '-').toLowerCase()}`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Single Create Task button */}
          <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
            + Create Task
          </button>
        </div>
      </div>

      {/* Board columns */}
      <main className="board-main">
        {STATUSES.map((status) => (
          <div key={status} className="status-column">
            <div className={`column-header status-${status.replace(' ', '-').toLowerCase()}`}>
              <span className="column-title">{status}</span>
              <span className="column-count">{statusGroups[status].length}</span>
            </div>

            <div className="tasks-grid">
              {statusGroups[status].length === 0 ? (
                <div className="empty-column">No tasks</div>
              ) : (
                statusGroups[status].map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onOpen={openTaskDetail}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Task Count Banner */}
      <div className="task-count-banner">
        Total Tasks: <strong>{tasks.length}</strong>
      </div>

      {/* Create Task Modal */}
      <Modal
        opened={createOpen}
        onClose={() => { setCreateOpen(false); setNewTaskName(''); }}
        title="Create New Task"
        centered
      >
        <TextInput
          label="Task Name"
          placeholder="Enter task name..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createTask()}
          data-autofocus
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => { setCreateOpen(false); setNewTaskName(''); }}>
            Cancel
          </Button>
          <Button onClick={createTask} disabled={!newTaskName.trim()}>
            Create
          </Button>
        </Group>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          key={selectedTask.id}
          opened={detailOpen}
          task={selectedTask}
          onClose={() => setDetailOpen(false)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
};

export default Board;
