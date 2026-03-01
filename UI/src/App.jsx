import "./App.css";
import Home from "./Pages/Home";
import Compare from "./Pages/Compare";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function selectComponent(path) {
  let component = <Home />;
  switch (path) {
    case "/compare":
      return <Compare />;
  }
  return component;
}
function App() {
  const location = window.document.location;

  return (
    <QueryClientProvider client={queryClient}>
      {selectComponent(location.pathname)}
    </QueryClientProvider>
  );
}

export default App;
