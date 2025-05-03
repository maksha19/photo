import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ImageGrid from "./pages/ImageGrid";
import Landing from "./pages/Landing";

function App() {
  return (
    <Routes>
      <Route path="/photo" element={<Home />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/getImage" element={<ImageGrid />} />
    </Routes>
  );
}

export default App;
