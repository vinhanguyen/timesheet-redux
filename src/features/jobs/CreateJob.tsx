import { useNavigate } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { Job } from "../../data";
import JobForm from "./JobForm";
import { createJob } from "./jobsSlice";

export default function CreateJob() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  function handleCancel() {
    navigate('/jobs');
  }

  function handleCreate(job: Job) {
    dispatch(createJob({...job}));
    navigate('/jobs');
  }

  return (
    <JobForm label="Create" onCancel={handleCancel} onSave={handleCreate} />
  );
}
