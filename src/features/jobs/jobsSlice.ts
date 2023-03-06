import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job, getJobs, createJob as createJobIdb, updateJob as updateJobIdb, deleteJob as deleteJobIdb, getCurrentJobId, setCurrentJobId as setCurrentJobIdIdb } from '../../data';
import { RootState, AppThunk } from '../../app/store';
import { loadTasks } from '../tasks/tasksSlice';

export interface JobsState {
  jobs: Job[];
  currentJobId: null|number;
}

const initialState: JobsState = {
  jobs: [],
  currentJobId: null,
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    loadJobsSuccess: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    loadCurrentJobIdSuccess: (state, action: PayloadAction<number>) => {
      state.currentJobId = action.payload;
    },
    createJobSuccess: (state, action: PayloadAction<Job>) => {
      state.jobs = [...state.jobs, action.payload];
    },
    updateJobSuccess: (state, action: PayloadAction<Job>) => {
      state.jobs = state.jobs.map(j => {
        if (j.id === action.payload.id) {
          return action.payload;
        }
        return j;
      });
    },
    deleteJobSuccess: (state, action: PayloadAction<number>) => {
      state.jobs = state.jobs.filter(j => j.id !== action.payload);
      if (state.currentJobId === action.payload) {
        state.currentJobId = null;
      }
    },
    setCurrentJobIdSuccess: (state, action: PayloadAction<number>) => {
      state.currentJobId = action.payload;
    },
  },
});

export const { loadJobsSuccess, loadCurrentJobIdSuccess, createJobSuccess, updateJobSuccess, deleteJobSuccess, setCurrentJobIdSuccess } = jobsSlice.actions;

export const selectJobs = (state: RootState) => state.jobs.jobs;

export const selectCurrentJobId = (state: RootState) => state.jobs.currentJobId;

export const selectCurrentJob = createSelector(
  [selectJobs, selectCurrentJobId],
  (jobs, id) => jobs.find(j => j.id === id)
);

export const selectJobById = createSelector(
  [selectJobs, (state, id) => id],
  (jobs, id) => jobs.find(j => j.id === id)
);

export const loadJobs = (): AppThunk => {
  return async (dispatch, getState) => {
    const jobs = await getJobs();
    dispatch(loadJobsSuccess(jobs));
  };
};

export const loadCurrentJobId = (): AppThunk => {
  return async (dispatch, getState) => {
    const id = await getCurrentJobId();
    dispatch(loadCurrentJobIdSuccess(id));
  };
};

export const createJob = (job: Job): AppThunk => {
  return async (dispatch, getState) => {
    const created = await createJobIdb(job);
    dispatch(createJobSuccess(created));
  };
};

export const updateJob = (job: Job): AppThunk => {
  return async (dispatch, getState) => {
    const updated = await updateJobIdb(job);
    dispatch(updateJobSuccess(updated));
  };
};

export const deleteJob = (id: number): AppThunk => {
  return async (dispatch, getState) => {
    const deletedId = await deleteJobIdb(id);
    dispatch(deleteJobSuccess(deletedId));
  };
};

export const setCurrentJobId = (id: number): AppThunk => {
  return async (dispatch, getState) => {
    const currentId = await setCurrentJobIdIdb(id);
    dispatch(setCurrentJobIdSuccess(currentId));
    dispatch(loadTasks());
  };
};

export default jobsSlice.reducer;
