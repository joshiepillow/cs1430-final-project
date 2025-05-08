import React from "react";

const DrawingPage = (props) => {
    return (
        <>
            <p>Time Left: {props.timeLeft}s</p>
            <p>
                Computer's Guess: {props.modelGuess || "Waiting for guess..."}
            </p>
            <p>Draw a {props.category}</p>
            {props.canvas}
        </>
    );
};

export default DrawingPage;
