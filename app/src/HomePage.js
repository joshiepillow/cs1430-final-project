import React from "react";
import Button from "@mui/material/Button";

const HomePage = (props) => {
    return (
        <div style={{ textAlign: "center" }}>
            <h1>Welcome to Don't Guess My Drawing!</h1>
            <Button onClick={props.onStart} variant="contained">
                Start Round
            </Button>
        </div>
    );
};

export default HomePage;
