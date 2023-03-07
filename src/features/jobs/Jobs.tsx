import { AddBox, Delete, Edit } from "@mui/icons-material";
import { IconButton, Radio, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ConfirmDialog from "../../ConfirmDialog";
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

  function handleDelete() {
    if (deletedJob) {
      dispatch(deleteJob(deletedJob.id));
    }
    setShowConfirm(false);
  }

  const [deletedJob, setDeletedJob] = useState<Job|null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <ConfirmDialog
        message={`Delete ${deletedJob?.name}?`}
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{textAlign: 'center'}}>
              <Link to="/jobs/create">
                <Tooltip title="Add job">
                  <AddBox color="action" />
                </Tooltip>
              </Link>
            </TableCell>
            <TableCell colSpan={3}></TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{textAlign: 'center'}}>Current</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map(j => (
            <TableRow key={j.id}>
              <TableCell sx={{textAlign: 'center'}}>
                <Tooltip title="Make this current job">
                  <Radio
                    checked={j.id === currentJobId}
                    onChange={() => handleChangeCurrent(j.id)}
                  />
                </Tooltip>
              </TableCell>
              <TableCell>{j.name}</TableCell>
              <TableCell>{formatCurrency(j.rate)}</TableCell>
              <TableCell sx={{display: 'flex', alignItems: 'center'}}>
                <Link to={`/jobs/${j.id}`}>
                  <Tooltip title="Edit">
                    <Edit color="action" />
                  </Tooltip>
                </Link>
                <IconButton onClick={() => {setDeletedJob(j); setShowConfirm(true);}}>
                  <Tooltip title="Delete">
                    <Delete />
                  </Tooltip>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {jobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} sx={{textAlign: 'center'}}>No jobs</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
