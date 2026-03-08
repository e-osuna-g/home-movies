import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import React, { lazy, Suspense } from "react";
const Compare = lazy(() => import("./Pages/Compare"));
const Home = lazy(() => import("./Pages/Home"));
function selectComponent(path) {
  if (path === "/compare" || path === "/compare/") {
    return <Compare />;
  } else {
    return <Home />;
  }
}
function App() {
  const location = window.document.location;

  return (
    <>
      <Suspense fallback={<CircularProgress />}>
        {selectComponent(location.pathname)}
      </Suspense>
    </>
  );
}

export default App;
