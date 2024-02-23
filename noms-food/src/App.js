import { useEffect } from "react";
import db from "./firebase";
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          NOMs will conquer the world
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          click here and we will eat you
        </a>
      </header>
    </div>
  );
}

export default App;
