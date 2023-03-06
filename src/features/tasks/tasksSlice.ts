import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, getTasks, punch as punchIdb, deleteTask as deleteTaskIdb, updateTask as updateTaskIdb } from '../../data';
import { RootState, AppThunk } from '../../app/store';
import { selectCurrentJobId } from '../jobs/jobsSlice';

export interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    punchSuccess: (state, {payload: task}: PayloadAction<Task>) => {
      const exists = state.tasks.find(t => t.id === task.id);
      if (exists) {
        state.tasks = state.tasks.map(t => {
          if (t.id === task.id) {
            return task;
          }
          return t;
        });
      } else {
        state.tasks = [...state.tasks, task];
      }
    },
    deleteTaskSuccess: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(({id}) => id !== action.payload);
    },
    updateTaskSuccess: (state, action: PayloadAction<Task>) => {
      state.tasks = state.tasks.map(t => {
        if (t.id === action.payload.id) {
          return action.payload;
        }
        return t;
      });
    },
  },
});

export const { loadTasksSuccess, punchSuccess, deleteTaskSuccess, updateTaskSuccess } = tasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;

export const selectUnfinishedTask = createSelector(
  [selectTasks], 
  (tasks: Task[]) => tasks.find(({finish}) => !finish)
);

export const loadTasks = (): AppThunk => {
  return async (dispatch, getState) => {
    const jobId = selectCurrentJobId(getState())
    const tasks = jobId ? await getTasks(jobId) : [];
    dispatch(loadTasksSuccess(tasks));
  };
};

export const punch = (): AppThunk => {
  return async (dispatch, getState) => {
    const task = await punchIdb();
    dispatch(punchSuccess(task));
  };
};

export const deleteTask = (id: number): AppThunk => {
  return async (dispatch, getState) => {
    const deletedId = await deleteTaskIdb(id);
    dispatch(deleteTaskSuccess(deletedId));
  };
};

export const updateTask = (task: Task): AppThunk => {
  return async (dispatch, getState) => {
    const updated = await updateTaskIdb(task);
    dispatch(updateTaskSuccess(updated));
  };
};

export default tasksSlice.reducer;
