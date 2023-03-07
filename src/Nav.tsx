import { Menu as MenuIcon, PunchClock } from "@mui/icons-material";
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectCurrentJob } from "./features/jobs/jobsSlice";
import { punch, selectUnfinishedTask } from "./features/tasks/tasksSlice";

export default function Nav() {
  const currentJob = useAppSelector(selectCurrentJob);
  const unfinishedTask = useAppSelector(selectUnfinishedTask);

  const dispatch = useAppDispatch();

  function handlePunch() {
    dispatch(punch());
  }
  
  const [anchorEl, setAnchorEl] = useState<null|HTMLElement>(null);

  const navigate = useNavigate();

  function handleMenu(e: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleMenuItem(to: string) {
    navigate(to);
    setAnchorEl(null);
  }

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton color="inherit" onClick={handleMenu}>
          <Tooltip title="Menu">
            <MenuIcon />
          </Tooltip>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleMenuItem('/')}>Timesheet</MenuItem>
          <MenuItem onClick={() => handleMenuItem('/jobs')}>Jobs</MenuItem>
          <MenuItem onClick={() => handleMenuItem('/help')}>Help</MenuItem>
        </Menu>
        <Typography variant="h6">{currentJob ? currentJob.name : 'Timesheet'}</Typography>
        <Button
          disabled={!currentJob}
          variant="outlined"
          startIcon={<PunchClock />}
          color={unfinishedTask ? 'error' : 'success'}
          onClick={handlePunch}
          sx={{marginLeft: 'auto'}}
        >
          {unfinishedTask ? 'Stop' : 'Start'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
