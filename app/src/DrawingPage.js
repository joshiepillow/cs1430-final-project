import React from "react";

const DrawingPage = (props) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                textAlign: "center",
            }}
        >
            <div
                style={{ fontSize: "24px", fontWeight: "bold", margin: "10px" }}
            >
                Time Left: {props.timeLeft}s
            </div>

            {props.canvas}

            <div
                style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    margin: "10px",
                }}
            >
                Computer's Guess: {props.modelGuess || "Waiting for guess..."}
            </div>
        </div>
    );
};

export default DrawingPage;
