import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { Job } from "../../data";
import { createJob } from "./jobsSlice";

export default function CreateJobForm() {
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  function handleCancel() {
    navigate('/jobs');
  }

  function handleCreate() {
    dispatch(createJob({name, rate: Number(rate)} as Job));
    navigate('/jobs');
  }

  const valid = name && rate && !isNaN(Number(rate));

  return (
    <div>
      <div>
        <label htmlFor="name">Name: </label>
        <input id="name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="name">Rate: </label>
          <input id="rate" value={rate} onChange={e => setRate(e.target.value)} />
      </div>
      <div>
        <button onClick={handleCancel}>Cancel</button>
        {' '}
        <button onClick={handleCreate} disabled={!valid}>Create</button>
      </div>
    </div>
  );
}
