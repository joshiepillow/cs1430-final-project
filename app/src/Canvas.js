import React from "react";
import { Button } from "@mui/material";

const Canvas = (props) => {
    const [lastX, setLastX] = React.useState(null);
    const [lastY, setLastY] = React.useState(null);
    const [isDrawing, setIsDrawing] = React.useState(false);

    React.useEffect(() => {
        if (props.image)
            props.canvasRef.current
                .getContext("2d")
                .putImageData(props.image, 0, 0);
    }, [props.image]);

    const mouseDown = (event) => {
        const [x, y] = [event.nativeEvent.offsetX, event.nativeEvent.offsetY];
        setLastX(x);
        setLastY(y);
        setIsDrawing(true);
    };

    const mouseMove = (event) => {
        if (!isDrawing || props.frozen) return;

        const [x, y] = [event.nativeEvent.offsetX, event.nativeEvent.offsetY];
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastX(x);
        setLastY(y);
    };

    const mouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext("2d");
        props.setImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };

    const clear = () => {
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        props.setImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };

    return (
        <>
            <canvas
                ref={props.canvasRef}
                width="600"
                height="600"
                style={{ border: "4px solid white" }}
                onMouseDown={mouseDown}
                onMouseMove={mouseMove}
                onMouseUp={mouseUp}
                onMouseLeave={mouseUp}
                willReadFrequently="true"
            />
            {!props.frozen ? <Button onClick={clear}>Clear</Button> : <></>}
        </>
    );
};

export default Canvas;
