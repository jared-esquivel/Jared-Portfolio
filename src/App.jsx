import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Projects from "./Pages/Projects";
import Media from "./Pages/Media";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/media" element={<Media />} />
      </Routes>
    </BrowserRouter>
  );
}
