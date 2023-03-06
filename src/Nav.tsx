import { NavLink } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { selectCurrentJob } from "./features/jobs/jobsSlice";

export default function Nav() {
  const currentJob = useAppSelector(selectCurrentJob);

  return (
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
    </ul>
  );
}
