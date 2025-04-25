import logo from './logo.svg';
import React from 'react';
import './App.css';

function App() {
  const [isMouseDown, setMouseDown] = React.useState(false)
  const [lastX, setLastX] = React.useState(0)
  const [lastY, setLastY] = React.useState(0)

  const mouseDown = (_) => {
    setMouseDown(true)
  }
  const mouseUp = (_) => {
    setMouseDown(false)
  }
  
  const mouseMove =(event) => {
    const [x, y] = [event.nativeEvent.offsetX, event.nativeEvent.offsetY]
    if (isMouseDown) {
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
                onMouseDown={mouseDown}
                onMouseUp={mouseUp}
                onMouseMove={mouseMove}
            />
      </header>
    </div>
  );
}

export default App;
