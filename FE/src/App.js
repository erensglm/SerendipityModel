// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/home/Home"
import Journey from "./pages/journey/Journey"
import Serendipity from "./pages/serendipity/Serendipity"
import About from "./pages/about/About"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/serendipity" element={<Serendipity />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
} 

export default App;
