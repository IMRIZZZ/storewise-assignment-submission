const STORAGE_KEY = 'storewise-tasks';

const loadTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
};

const initialState = {
  tasks: loadTasks(),
  loading: false,
};

export default function taskReducer(state = initialState, action) {
  let newTasks;
  switch (action.type) {
    case 'ADD_TASK':
      newTasks = [...state.tasks, action.payload];
      saveTasks(newTasks);
      return { ...state, tasks: newTasks };

    case 'UPDATE_TASK':
      newTasks = state.tasks.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      saveTasks(newTasks);
      return { ...state, tasks: newTasks };

    case 'DELETE_TASK':
      newTasks = state.tasks.filter((t) => t.id !== action.payload);
      saveTasks(newTasks);
      return { ...state, tasks: newTasks };

    case 'CLONE_TASK': {
      const src = state.tasks.find((t) => t.id === action.payload.sourceId);
      if (!src) return state;
      const cloned = { ...src, id: action.payload.newId, name: `${src.name} (Copy)` };
      newTasks = [...state.tasks, cloned];
      saveTasks(newTasks);
      return { ...state, tasks: newTasks };
    }

    default:
      return state;
  }
}
