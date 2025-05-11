import React from "react";
import DrawingPage from "./DrawingPage";
import CategoryChoicePage from "./CategoryChoicePage";
import HomePage from "./HomePage";
import ResultPage from "./ResultPage";
import Canvas from "./Canvas";
import ProbabilityOverlay from "./ProbabilityOverlay";
import categoriesFile from "./categories.txt";
import "./App.css";

function App() {
    const canvasRef = React.useRef(null);
    const [image, setImage] = React.useState(null);
    const [categories, setCategories] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [drawing, setDrawing] = React.useState("homepage");
    const [modelGuess, setModelGuess] = React.useState(null);
    const [probabilities, setProbabilities] = React.useState([]);
    const [roundActive, setRoundActive] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(20);
    const [showPopup, setShowPopup] = React.useState(false);
    const [selectedMode, setSelectedMode] = React.useState("easy"); // Default mode is "easy"

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

    const reset = () => {
        setDrawing("categoryChoice");
        setImage(null);
        setModelGuess(null);
        setProbabilities([]);
        setShowPopup(false);
    };

    const startRound = (selectedCategory) => {
        setCategory(selectedCategory);
        setTimeLeft(20);
        setRoundActive(true);
        setDrawing("drawing");
    };

    const endRound = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataUrl = canvas.toDataURL("image/png");
            setImage(dataUrl);
        }
        setRoundActive(false);
        setDrawing("result");
        setShowPopup(true);
    };

    React.useEffect(() => {
        let interval = null;
        let isFetching = false;

        if (roundActive) {
            interval = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft <= 0) {
                        clearInterval(interval);
                        endRound();
                        return 0;
                    }

                    if (prevTimeLeft % 2 === 0 && !isFetching) {
                        isFetching = true;
                        const canvas = canvasRef.current;
                        canvas.toBlob((blob) => {
                            const formData = new FormData();
                            formData.append("image", blob, "canvas.png");

                            fetch("http://127.0.0.1:5000/process-image", {
                                method: "POST",
                                body: formData,
                            })
                                .then((response) => response.json())
                                .then((result) => {
                                    const sortedProbabilities = Object.entries(
                                        result
                                    )
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 10);
                                    setProbabilities(sortedProbabilities);

                                    const topGuess = sortedProbabilities[0][0];
                                    setModelGuess(topGuess);

                                    if (topGuess === category) {
                                        clearInterval(interval);
                                        endRound();
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

    const canvas = (
        <Canvas
            canvasRef={canvasRef}
            frozen={drawing !== "drawing"}
            image={image}
            setImage={setImage}
        />
    );

    const handlePopupClose = () => {
        setShowPopup(false);
        setDrawing("homepage");
    };

    const handleModeChange = (mode) => {
        setSelectedMode(mode);
    };

    const choosePage = () => {
        switch (drawing) {
            case "homepage":
                return (
                    <HomePage
                        onStart={reset}
                        selectedMode={selectedMode}
                        onModeChange={handleModeChange}
                    />
                );
            case "categoryChoice":
                return (
                    <CategoryChoicePage
                        categories={categories}
                        onCategorySelect={startRound}
                    />
                );
            case "drawing":
                return (
                    <DrawingPage
                        canvas={canvas}
                        category={category}
                        timeLeft={timeLeft}
                        modelGuess={modelGuess}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="App">
            <header className="App-header">{choosePage()}</header>
            <ProbabilityOverlay probabilities={probabilities} />
            {showPopup && (
                <ResultPage
                    category={category}
                    modelGuess={modelGuess}
                    image={image}
                    onClose={handlePopupClose}
                />
            )}
        </div>
    );
}

export default App;
