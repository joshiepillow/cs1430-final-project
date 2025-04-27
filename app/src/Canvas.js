import React from 'react';
import { Button } from '@mui/material'

const Canvas = (props) => {
    const [lastX, setLastX] = React.useState(0)
    const [lastY, setLastY] = React.useState(0)

    const mouseMove = (event) => {
        const [x, y] = [event.nativeEvent.offsetX, event.nativeEvent.offsetY]
        if (event.buttons & 1) {
            const ctx = props.canvasRef.current.getContext("2d")
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
        const ctx = props.canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, props.canvasRef.current.width, props.canvasRef.current.height);
    }

    return <>
        <canvas
            ref={props.canvasRef}
            width="600"
            height="600"
            style={{ border: "4px solid white" }}
            onMouseMove={mouseMove}
        />
        <Button onClick={clear}>Clear</Button>
    </>
}

export default Canvas;