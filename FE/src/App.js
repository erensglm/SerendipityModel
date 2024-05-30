import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Journey from "./pages/journey/Journey";
import Journeying from "./pages/journey/Journeying";
import Serendipity from "./pages/serendipity/Serendipity";
import About from "./pages/about/About";
import background from "./background.mp4";
import Results from "./pages/journey/Results";

const App = () => {
  return (
    <Router>
      <div style={{ position: "relative" }}>
        <video
          autoPlay
          muted
          loop
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={background} type="video/mp4" />
        </video>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/journeying" element={<Journeying />} />
            <Route path="/serendipity" element={<Serendipity />} />
            <Route path="/about" element={<About />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
