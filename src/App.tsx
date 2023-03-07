import React from 'react';
import { Outlet } from 'react-router';
import './App.css';
import Nav from './Nav';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <Nav />
      <Outlet />
    </>
  );
}

export default App;
