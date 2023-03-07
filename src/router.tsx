import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import CreateJob from "./features/jobs/CreateJob";
import EditJob from "./features/jobs/EditJob";
import Jobs from "./features/jobs/Jobs";
import Tasks from "./features/tasks/Tasks";
import Help from "./Help";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Tasks />
      },
      {
        path: 'jobs',
        element: <Jobs />
      },
      {
        path: 'jobs/create',
        element: <CreateJob />
      },
      {
        path: 'jobs/:id',
        element: <EditJob />
      },
      {
        path: 'help',
        element: <Help />
      },
    ]
  }
]);
