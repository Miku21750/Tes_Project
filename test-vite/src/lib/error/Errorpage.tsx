import { useRouteError, isRouteErrorResponse } from "react-router"; // or "@remix-run/react"

const ErrorPage = () => {
  // 1. Get the error object
  const error = useRouteError();
  console.error(error); // Log to console for debugging

  // 2. Initialize default variables
  let errorMessage = "An unexpected error has occurred.";
  let errorStatus = 500;

  // 3. Type Narrowing (TypeScript Magic)
  if (isRouteErrorResponse(error)) {
    // This handles errors thrown by the router (like 404 Not Found)
    errorMessage = error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    // This handles standard Javascript errors (like undefined variables)
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // This handles errors thrown as strings
    errorMessage = error;
  }

  // 4. Render the UI
  return (
    <div id="error-page" style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Oops! {errorStatus}</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="bg-fuchsia-200 rounded-2xl p-2 font-black italic text-xl">
        <i>{errorMessage}</i>
      </p>
      <p>I think i dont why, Better luck next time</p>
<p>Here is a teapot icon: <span>🫖</span></p>

    </div>
  );
};

export default ErrorPage;
