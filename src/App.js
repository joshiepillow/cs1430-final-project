import logo from './logo.svg';
import React from 'react';
import { Button } from '@mui/material'
import './App.css';

function App() {
  const [lastX, setLastX] = React.useState(0)
  const [lastY, setLastY] = React.useState(0)
  const canvasRef = React.useRef(null)
  
  const mouseMove = (event) => {
    const [x, y] = [event.nativeEvent.offsetX, event.nativeEvent.offsetY]
    if (event.buttons & 1) {
      const ctx = canvasRef.current.getContext("2d")
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

  const clear = (_) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Draw</p>
        <canvas
                ref={canvasRef}
                width="600"
                height="600"
                style={{ border: "4px solid white" }}
                onMouseMove={mouseMove}
            />
        <Button onClick={clear}>Clear</Button>
      </header>
    </div>
  );
}

export default App;
