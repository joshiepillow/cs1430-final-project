import React from 'react';
import { Button } from '@mui/material';

const DrawingPage = (props) => {
    const sendCanvas = async () => {
        props.setDrawing("guessing");
        const canvas = props.canvas.props.canvasRef.current;
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("image", blob, "canvas.png");
        
            try {
                const response = await fetch("http://localhost:5000/process-image", {
                    method: "POST",
                    body: formData,
                });
        
                const result = await response.json();
                alert(JSON.stringify(result));
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    };

    return <>
        <p>Draw a {props.category}</p>
        {props.canvas}
        <Button onClick={sendCanvas}>Submit Drawing</Button>
    </>;
}

export default DrawingPage;