import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Job } from "../../data";
import { selectJobById, updateJob } from "./jobsSlice";

export default function EditJobForm() {
  const {id} = useParams();

  const job = useAppSelector(state => selectJobById(state, Number(id)));
  
  const [name, setName] = useState(job?.name);
  const [rate, setRate] = useState(job?.rate+'');

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  function handleCancel() {
    navigate('/jobs');
  }

  function handleSave() {
    dispatch(updateJob({...job, name, rate: Number(rate)} as Job));
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
        <button onClick={handleSave} disabled={!valid}>Save</button>
      </div>
    </div>
  );
}
