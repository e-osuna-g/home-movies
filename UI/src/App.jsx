import "./App.css";
import Home from "./Pages/Home";
import Compare from "./Pages/Compare";

function selectComponent(path) {
  let component = <Home />;
  if (path === "/compare" || path === "/compare/") {
    return <Compare />;
  }
  return component;
}
function App() {
  const location = window.document.location;

  return (
    <>
      {selectComponent(location.pathname)}
    </>
  );
}

export default App;
