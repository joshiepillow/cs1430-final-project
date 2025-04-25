import logo from './logo.svg';
import React from 'react';
import './App.css';

function App() {
  const [lastX, setLastX] = React.useState(0)
  const [lastY, setLastY] = React.useState(0)
  
  const mouseMove =(event) => {
    const [x, y] = [event.nativeEvent.offsetX, event.nativeEvent.offsetY]
    if (event.buttons & 1) {
      const ctx = event.target.getContext("2d")
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 4;
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
    setLastX(x)
    setLastY(y)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Draw</p>
        <canvas
                width="600"
                height="600"
                style={{ border: "4px solid white" }}
                onMouseMove={mouseMove}
            />
      </header>
    </div>
  );
}

export default App;
