import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function JobForm({job = {name: '', rate: ''}, onCancel, onSave, label = 'Submit'}: any) {
  const [name, setName] = useState(job.name);
  const [rate, setRate] = useState(job.rate+'');

  const valid = name && rate && !isNaN(Number(rate));

  function handleSubmit() {
    onSave({...job, name, rate: Number(rate)});
  }

  return (
    <Box p={2}>
      <Box sx={{display: 'flex'}}>
        <TextField variant="standard" label="Name" value={name} onChange={e => setName(e.target.value)} sx={{flex: 1, marginRight: 2}} />
        <TextField variant="standard" label="Rate" value={rate} onChange={e => setRate(e.target.value)} sx={{flex: 1}} />
      </Box>
      <Box mt={2}>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        {' '}
        <Button variant="contained" onClick={handleSubmit} disabled={!valid}>{label}</Button>
      </Box>
    </Box>
  );
}