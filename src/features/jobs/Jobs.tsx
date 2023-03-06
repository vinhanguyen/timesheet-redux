import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Job } from "../../data";
import { formatCurrency } from "../../utils";
import { deleteJob, selectCurrentJobId, selectJobs, setCurrentJobId } from "./jobsSlice";

export default function Jobs() {
  const jobs = useAppSelector(selectJobs);
  const currentJobId = useAppSelector(selectCurrentJobId);

  const dispatch = useAppDispatch();

  function handleChangeCurrent(id: number) {
    dispatch(setCurrentJobId(id));
  }

  function handleDelete(job: Job) {
    if (window.confirm(`Delete ${job.name}?`)) {
      dispatch(deleteJob(job.id));
    }
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={4}>
              <Link to="/jobs/create">Add</Link>
            </th>
          </tr>
          <tr>
            <th>Current</th>
            <th>Name</th>
            <th>Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id}>
              <td>
                <input type="radio" 
                  checked={j.id === currentJobId} 
                  onChange={() => handleChangeCurrent(j.id)}
                  title="Make this current job" />
              </td>
              <td>{j.name}</td>
              <td>{formatCurrency(j.rate)}</td>
              <td>
                <Link to={`/jobs/${j.id}`}>Edit</Link>
                {' '}
                <button onClick={() => handleDelete(j)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
