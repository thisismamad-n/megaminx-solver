import { useState, useCallback } from 'react';
import './App.css';
import MegaminxVisualizer from './components/MegaminxVisualizer.jsx';

// Standard Megaminx colors
const MEGAMINX_COLORS = {
  WHITE: '#FFFFFF',    // Face 0: White (top)
  BLUE: '#0000FF',     // Face 1: Blue
  YELLOW: '#FFFF00',   // Face 2: Yellow
  PURPLE: '#500050',   // Face 3: Purple
  GREEN: '#006400',    // Face 4: Green
  RED: '#FF0000',      // Face 5: Red
  GRAY: '#505050',     // Face 6: Gray
  CYAN: '#00FFFF',     // Face 7: Cyan
  ORANGE: '#FFA500',   // Face 8: Orange
  LIME: '#65FE08',     // Face 9: Lime Green
  PINK: '#FC6C85',     // Face 10: Pink
  VANILLA: '#F3E5AB'   // Face 11: Vanilla
};

// Initialize the Megaminx state with each face having its own color
const initializeMegaminx = () => {
  const state = [];
  for (let i = 0; i < 12; i++) {
    // Each face has 6 tiles (1 center + 5 edge tiles)
    const face = Array(6).fill(i);
    state.push(face);
  }
  return state;
};

function App() {
  const [selectedColor, setSelectedColor] = useState(0); // Index of selected color
  const [selectedFace, setSelectedFace] = useState(null);
  const [megaminxState, setMegaminxState] = useState(initializeMegaminx());

  const handleFaceClick = useCallback((faceIndex) => {
    console.log('Face clicked:', faceIndex);
    setSelectedFace(faceIndex);
  }, []);

  const handleColorSelect = (colorIndex) => {
    setSelectedColor(colorIndex);
    if (selectedFace !== null) {
      const newState = [...megaminxState];
      newState[selectedFace] = Array(6).fill(colorIndex);
      setMegaminxState(newState);
      setSelectedFace(null); // Reset selected face after coloring
    }
  };

  const handleUndo = () => {
    console.log('Undo clicked');
  };

  const handleRedo = () => {
    console.log('Redo clicked');
  };

  const handleScramble = () => {
    console.log('Scramble clicked');
    // TODO: Implement scramble functionality
  };

  const handleSolve = () => {
    console.log('Solve clicked');
    // TODO: Implement solve functionality
  };

  const handleReset = () => {
    console.log('Reset clicked');
    setMegaminxState(initializeMegaminx());
    setSelectedFace(null);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Megaminx Solver</h1>
      </div>

      <div className="main-content">
        <div className="megaminx-container">
          <MegaminxVisualizer 
            state={megaminxState}
            onFaceClick={handleFaceClick}
          />
        </div>

        <div className="controls-container">
          <div className="button-group">
            <button className="control-btn" onClick={handleUndo}>
              <i className="fas fa-undo"></i>
              <span>Undo</span>
            </button>
            <button className="control-btn" onClick={handleRedo}>
              <i className="fas fa-redo"></i>
              <span>Redo</span>
            </button>
            <button className="control-btn" onClick={handleScramble}>
              <i className="fas fa-random"></i>
              <span>Scramble</span>
            </button>
            <button className="control-btn solve-btn" onClick={handleSolve}>
              <i className="fas fa-magic"></i>
              <span>Solve</span>
            </button>
            <button className="control-btn" onClick={handleReset}>
              <i className="fas fa-sync-alt"></i>
              <span>Reset</span>
            </button>
          </div>
          
          <div className="color-picker">
            {Object.entries(MEGAMINX_COLORS).map(([colorName, colorValue], index) => (
              <button
                key={colorName}
                className={`color-btn ${selectedColor === index ? 'selected' : ''}`}
                style={{ backgroundColor: colorValue }}
                onClick={() => handleColorSelect(index)}
                title={colorName}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 