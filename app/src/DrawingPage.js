import React from "react";
import { Button } from "@mui/material";

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
            <Button
                variant="contained"
                onClick={() => props.endRound()}
                style={{
                    margin: "10px",
                    backgroundColor: "#FF5733",
                    color: "white",
                }}
            >
                End Round
            </Button>
        </div>
    );
};

export default DrawingPage;
