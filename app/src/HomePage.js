import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";

const HomePage = (props) => {
    const [buttonStates, setButtonStates] = useState({
        easy: props.selectedMode === "easy" ? "success" : "default",
        medium: props.selectedMode === "medium" ? "success" : "default",
        hard: props.selectedMode === "hard" ? "success" : "default",
    });

    useEffect(() => {
        setButtonStates({
            easy: props.selectedMode === "easy" ? "success" : "default",
            medium: props.selectedMode === "medium" ? "success" : "default",
            hard: props.selectedMode === "hard" ? "success" : "default",
        });
    }, [props.selectedMode]);

    const handleModeChange = async (mode) => {
        setButtonStates((prev) => ({
            easy: "default",
            medium: "default",
            hard: "default",
            [mode]: "loading",
        }));
        try {
            const response = await fetch("http://127.0.0.1:5000/set-mode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode }),
            });
            if (response.ok) {
                setButtonStates((prev) => ({
                    easy: "default",
                    medium: "default",
                    hard: "default",
                    [mode]: "success",
                }));
                props.onModeChange(mode);
            } else {
                setButtonStates((prev) => ({
                    ...prev,
                    [mode]: "error",
                }));
            }
        } catch (error) {
            setButtonStates((prev) => ({
                ...prev,
                [mode]: "error",
            }));
        }
    };

    const getButtonStyle = (state) => {
        switch (state) {
            case "loading":
                return { backgroundColor: "gray" };
            case "success":
                return { backgroundColor: "green" };
            case "error":
                return { backgroundColor: "red" };
            default:
                return {};
        }
    };

    return (
        <>
            <div
                style={{
                    textAlign: "center",
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h1>Welcome to Don't Guess My Drawing!</h1>
                <Button onClick={props.onStart} variant="contained">
                    Start Round
                </Button>
            </div>
            <div
                style={{ position: "absolute", bottom: "20px", width: "100%" }}
            >
                <p>Choose a Mode</p>
                {["easy", "medium", "hard"].map((mode) => (
                    <Button
                        key={mode}
                        onClick={() => handleModeChange(mode)}
                        variant="contained"
                        style={{
                            margin: "5px",
                            ...getButtonStyle(buttonStates[mode]),
                        }}
                        disabled={buttonStates[mode] === "loading"}
                    >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                ))}
            </div>
        </>
    );
};

export default HomePage;
