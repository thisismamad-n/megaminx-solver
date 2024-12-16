import { useState } from 'react';
import './App.css';

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF5733');

  return (
    <div className="app-container">
      <div className="header">
        <h1>Megaminx Solver</h1>
      </div>

      <div className="main-content">
        <div className="megaminx-container">
          {/* Megaminx 3D visualization will go here */}
          <div className="megaminx-placeholder">
            <span>Megaminx Visualization Coming Soon</span>
          </div>
        </div>

        <div className="controls-container">
          <div className="button-group">
            <button className="control-btn">
              <i className="fas fa-undo"></i>
              <span>Undo</span>
            </button>
            <button className="control-btn">
              <i className="fas fa-redo"></i>
              <span>Redo</span>
            </button>
            <button className="control-btn">
              <i className="fas fa-random"></i>
              <span>Scramble</span>
            </button>
            <button className="control-btn solve-btn">
              <i className="fas fa-magic"></i>
              <span>Solve</span>
            </button>
            <button className="control-btn">
              <i className="fas fa-sync-alt"></i>
              <span>Reset</span>
            </button>
          </div>
          
          <div className="color-picker">
            <input 
              type="color" 
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="color-input"
            />
            <span className="color-label">Color Picker</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 