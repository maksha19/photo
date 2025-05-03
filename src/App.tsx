import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";

function App() {
  return (
    <Routes>
      <Route path="/photo" element={<Home />} />
      <Route path="/landing" element={<Landing />} />
    </Routes>
  );
}

export default App;
