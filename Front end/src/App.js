import React from "react";
import Home from "./screens/home/home.js";
import { AudioProvider } from './AudioContext';

function App() {
  return (
    <AudioProvider>
      <div>
        <Home />
      </div>
    </AudioProvider>
  );
}

export default App;