import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <ul>
      <li>
        <NavLink to="/">Timesheet</NavLink>
      </li>
      <li>
        <NavLink to="/jobs">Jobs</NavLink>
      </li>
    </ul>
  );
}
