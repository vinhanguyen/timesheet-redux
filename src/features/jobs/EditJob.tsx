import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Job } from "../../data";
import JobForm from "./JobForm";
import { selectJobById, updateJob } from "./jobsSlice";

export default function EditJob() {
  const {id} = useParams();

  const job = useAppSelector(state => selectJobById(state, Number(id)));

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  function handleCancel() {
    navigate('/jobs');
  }

  function handleSave(update: Job) {
    dispatch(updateJob({...job, ...update}));
    navigate('/jobs');
  }

  return (
    <JobForm label="Save" job={job} onCancel={handleCancel} onSave={handleSave} />
  );
}
