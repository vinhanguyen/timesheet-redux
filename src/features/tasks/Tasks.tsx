import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Task } from "../../data";
import EditableValue from "../../EditableValue";
import { copyToClipboard, formatCurrency, formatTimestamp, getHms, msToHours } from "../../utils";
import { selectCurrentJob } from "../jobs/jobsSlice";
import { deleteTask, loadTasks, punch, selectTasks, selectUnfinishedTask, updateTask } from "./tasksSlice";

export default function Tasks() {
  const tasks = useAppSelector(selectTasks);
  const currentJob = useAppSelector(selectCurrentJob);
  const unfinishedTask = useAppSelector(selectUnfinishedTask);

  const [now, setNow] = useState(Date.now());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTasks());
  }, [currentJob]);

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
    if (window.confirm(`Delete ${selectedIds.length} tasks?`)) {
      for (const id of selectedIds) {
        dispatch(deleteTask(id));
      }
      setSelectedIds([]);
      setSelectAll(false);
    }
  }

  function handlePunch() {
    dispatch(punch());
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
    <table>
      <thead>
        <tr>
          <th colSpan={7}>
            <button onClick={handleDelete} disabled={selectedIds.length === 0}>Delete</button>
            {' '}
            <button onClick={handlePunch} disabled={!currentJob}
              style={{backgroundColor: unfinishedTask ? "lightsalmon" : "lightgreen"}}>
              {unfinishedTask ? 'Stop' : 'Start'}
            </button>
          </th>
        </tr>
        <tr>
          <th>
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
          </th>
          <th>Start</th>
          <th>Finish</th>
          <th>Time</th>
          <th>Rate</th>
          <th>Total</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(t => (
          <tr key={t.id}>
            <td>
              <input type="checkbox" 
                checked={selectedIds.some(id => id === t.id)} 
                onChange={e => handleSelect(e.target.checked, t.id)} />
            </td>
            <td>{formatTimestamp(t.start)}</td>
            <td>{formatTimestamp(t.finish || now)}</td>
            <td>{formatTime(timeDiff(t))}</td>
            <td>{formatCurrency(currentJob?.rate || 0)}</td>
            <td>{formatCurrency(msToHours(timeDiff(t))*(currentJob?.rate || 0))}</td>
            <td>
              <EditableValue value={t.comment} 
                onSave={(comment: string) => handleUpdate({...t, comment})} />
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={3}></td>
          <td>
            {formatTime(totalTime)}
            {' '}
            <button onClick={handleCopy}>Copy</button>
          </td>
          <td>{formatCurrency(currentJob?.rate || 0)}</td>
          <td>{formatCurrency(msToHours(totalTime)*(currentJob?.rate || 0))}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
}
