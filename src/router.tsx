import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import CreateJobForm from "./features/jobs/CreateJobForm";
import EditJobForm from "./features/jobs/EditJobForm";
import Jobs from "./features/jobs/Jobs";
import Tasks from "./features/tasks/Tasks";

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
        element: <CreateJobForm />
      },
      {
        path: 'jobs/:id',
        element: <EditJobForm />
      },
    ]
  }
]);
