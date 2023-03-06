import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectCurrentJob } from "./features/jobs/jobsSlice";
import { punch, selectUnfinishedTask } from "./features/tasks/tasksSlice";

export default function Nav() {
  const currentJob = useAppSelector(selectCurrentJob);
  const unfinishedTask = useAppSelector(selectUnfinishedTask);

  const dispatch = useAppDispatch();

  function handlePunch() {
    dispatch(punch());
  }

  return (
    <nav>
      <ul>
        {currentJob && (
          <li>
            <h2>{currentJob.name}</h2>
          </li>
        )}
        <li>
          <NavLink to="/">Timesheet</NavLink>
        </li>
        <li>
          <NavLink to="/jobs">Jobs</NavLink>
        </li>
        <li>
          <NavLink to="/help">Help</NavLink>
        </li>
        <li>
          <button onClick={handlePunch} disabled={!currentJob}
            style={{backgroundColor: unfinishedTask ? "lightsalmon" : "lightgreen"}}>
            {unfinishedTask ? 'Stop' : 'Start'}
          </button>
        </li>
      </ul>
    </nav>
  );
}
