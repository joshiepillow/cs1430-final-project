import React from "react";
import DrawingPage from "./DrawingPage";
import GuessingPage from "./GuessingPage";
import ResultPage from "./ResultPage";
import Canvas from "./Canvas";
import categoriesFile from "./categories.txt";
import "./App.css";
import { Button } from "@mui/material";

function App() {
    const canvasRef = React.useRef(null);
    const [image, setImage] = React.useState(null);
    const [categories, setCategories] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [drawing, setDrawing] = React.useState("drawing");
    const [guess, setGuess] = React.useState(null);
    const [modelGuess, setModelGuess] = React.useState(null);
    const [roundActive, setRoundActive] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(20);

    React.useEffect(() => {
        try {
            fetch(categoriesFile)
                .then((res) => res.text())
                .then((res) => {
                    setCategories(res.split("\n"));
                });
        } catch (error) {
            alert("Error: " + error.message);
        }
    }, []);

    const newCategory = () => {
        if (categories)
            setCategory(
                categories[Math.floor(Math.random() * categories.length)]
            );
    };

    const reset = () => {
        setDrawing("drawing");
        newCategory();
        setImage(null);
        setGuess(null);
        setModelGuess(null);
    };

    const startRound = () => {
        reset();
        setTimeLeft(20);
        setRoundActive(true);
    };

    React.useEffect(() => {
        let interval = null;
        let isFetching = false;

        if (roundActive) {
            interval = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft <= 0) {
                        clearInterval(interval);
                        alert(
                            "Time's up! The correct category was " + category
                        );
                        setRoundActive(false);
                        setDrawing("result");
                        return 0;
                    }

                    if (prevTimeLeft % 2 === 0 && !isFetching) {
                        isFetching = true;
                        const canvas = canvasRef.current;
                        canvas.toBlob((blob) => {
                            const formData = new FormData();
                            formData.append("image", blob, "canvas.png");

                            console.log(
                                "Sending image to server at time:",
                                Date.now()
                            );
                            fetch("http://localhost:5000/process-image", {
                                method: "POST",
                                body: formData,
                            })
                                .then((response) => response.json())
                                .then((result) => {
                                    const topGuess = Object.keys(result).reduce(
                                        (a, b) =>
                                            result[a] > result[b] ? a : b
                                    );
                                    setModelGuess(topGuess);

                                    if (topGuess === category) {
                                        alert(
                                            `Correct! The category was ${category}`
                                        );
                                        clearInterval(interval);
                                        setRoundActive(false);
                                        setDrawing("result");
                                    }
                                })
                                .catch((error) =>
                                    console.error("Error:", error.message)
                                )
                                .finally(() => {
                                    isFetching = false;
                                });
                        });
                    }

                    return prevTimeLeft - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [roundActive, category]);

    if (!category) newCategory();

    const canvas = (
        <Canvas
            canvasRef={canvasRef}
            frozen={drawing !== "drawing"}
            image={image}
            setImage={setImage}
        />
    );

    const choosePage = () => {
        switch (drawing) {
            case "drawing":
                return (
                    <DrawingPage
                        canvas={canvas}
                        category={category}
                        timeLeft={timeLeft}
                        modelGuess={modelGuess}
                    />
                );
            case "guessing":
                return (
                    <GuessingPage
                        canvas={canvas}
                        categories={categories}
                        guess={guess}
                        setGuess={setGuess}
                        setDrawing={setDrawing}
                    />
                );
            case "result":
                return (
                    <ResultPage
                        canvas={canvas}
                        modelGuess={modelGuess}
                        guess={guess}
                        restart={reset}
                    />
                );
            default:
                return (
                    <p>
                        Something went wrong. Please refresh the page and try
                        again.
                    </p>
                );
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                {!roundActive && (
                    <Button onClick={startRound}>Start Round</Button>
                )}
                {choosePage()}
            </header>
        </div>
    );
}

export default App;
