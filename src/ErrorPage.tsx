import { useNavigate, useRouteError } from "react-router";

export default function ErrorPage() {
  const error: any = useRouteError();

  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  return (
    <div>
      <h2>Error</h2>
      <p>{error.statusText || error.message}</p>
      <button onClick={handleBack}>Back</button>
    </div>
  );
}
