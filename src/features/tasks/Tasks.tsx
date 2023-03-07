import { ContentCopy, Delete } from "@mui/icons-material";
import { Checkbox, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ConfirmDialog from "../../ConfirmDialog";
import { Task } from "../../data";
import EditableValue from "../../EditableValue";
import { copyToClipboard, formatCurrency, formatTimestamp, getHms, msToHours } from "../../utils";
import { selectCurrentJob } from "../jobs/jobsSlice";
import { deleteTask, loadTasks, selectTasks, updateTask } from "./tasksSlice";

export default function Tasks() {
  const tasks = useAppSelector(selectTasks);
  const currentJob = useAppSelector(selectCurrentJob);

  const [now, setNow] = useState(Date.now());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch, currentJob]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function handleSelectAll(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectAll(true);
      setSelectedIds(tasks.map(({id}) => id));
    } else {
      setSelectAll(false);
      setSelectedIds([]);
    }
  }

  function handleSelect(checked: boolean, taskId: number) {
    if (checked && !selectedIds.some(id => id === taskId)) {
      setSelectedIds([...selectedIds, taskId]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== taskId));
      setSelectAll(false);
    }
  }

  function handleDelete() {
    for (const id of selectedIds) {
      dispatch(deleteTask(id));
    }
    setSelectedIds([]);
    setSelectAll(false);
    setShowConfirm(false);
  }

  function handleUpdate(task: Task) {
    dispatch(updateTask(task));
  }

  function timeDiff(task: Task) {
    return Math.max((task.finish || now)-task.start, 0);
  }

  const totalTime = tasks.reduce((sum, t) => {
    return sum+timeDiff(t);
  }, 0);

  function formatTime(time: number) {
    const [h, m, s] = getHms(time);
    return `${h}h ${m}m ${s}s`;
  }

  function handleCopy() {
    copyToClipboard(msToHours(totalTime).toFixed(2));
  }

  return (
    <>
      <ConfirmDialog
        message={`Delete ${selectedIds.length} tasks?`}
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{textAlign: 'center'}}>
              <IconButton onClick={() => setShowConfirm(true)} disabled={selectedIds.length === 0}>
                <Tooltip title="Delete">
                  <Delete />
                </Tooltip>
              </IconButton>
            </TableCell>
            <TableCell colSpan={6}></TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{textAlign: 'center'}}>
              <Tooltip title="Select all">
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
              </Tooltip>
            </TableCell>
            <TableCell>Start</TableCell>
            <TableCell>Finish</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(t => (
            <TableRow key={t.id}>
              <TableCell sx={{textAlign: 'center'}}>
                <Tooltip title="Select">
                  <Checkbox 
                    checked={selectedIds.some(id => id === t.id)} 
                    onChange={e => handleSelect(e.target.checked, t.id)} />
                </Tooltip>
              </TableCell>
              <TableCell>{formatTimestamp(t.start)}</TableCell>
              <TableCell>{formatTimestamp(t.finish || now)}</TableCell>
              <TableCell>{formatTime(timeDiff(t))}</TableCell>
              <TableCell>{formatCurrency(currentJob?.rate || 0)}</TableCell>
              <TableCell>{formatCurrency(msToHours(timeDiff(t))*(currentJob?.rate || 0))}</TableCell>
              <TableCell>
                <EditableValue value={t.comment} 
                  onSave={(comment: string) => handleUpdate({...t, comment})} />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell>
              {formatTime(totalTime)}
              <IconButton onClick={handleCopy}>
                <Tooltip title="Copy hours">
                  <ContentCopy />
                </Tooltip>
              </IconButton>
            </TableCell>
            <TableCell>{formatCurrency(currentJob?.rate || 0)}</TableCell>
            <TableCell>{formatCurrency(msToHours(totalTime)*(currentJob?.rate || 0))}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
