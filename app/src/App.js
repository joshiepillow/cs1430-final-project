import React from 'react';
import DrawingPage from './DrawingPage';
import GuessingPage from './GuessingPage';
import ResultPage from './ResultPage';
import Canvas from './Canvas';
import categoriesFile from './categories.txt';
import './App.css';

function App() {
    const canvasRef = React.useRef(null);
    const [image, setImage] = React.useState(null);
    const [categories, setCategories] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [drawing, setDrawing] = React.useState("drawing");
    const [guess, setGuess] = React.useState(null);
    const [modelGuess, setModelGuess] = React.useState(null);

    React.useEffect(() => {
        try {
            fetch(categoriesFile).then(res => res.text())
                .then(res => { setCategories(res.split("\n")) })
        } catch (error) {
            alert("Error: " + error.message);
        }
    }, [])

    const newCategory = () => {
        if (categories)
            setCategory(categories[Math.floor(Math.random() * categories.length)])
    }

    const reset = () => {
        setDrawing("drawing");
        newCategory();
        setImage(null);
        setGuess(null);
        setModelGuess(null);
    }

    if (!category) newCategory()

    const canvas = <Canvas canvasRef={canvasRef} frozen={drawing != "drawing"} image={image} setImage={setImage}/>

    const choosePage = () => {
        switch(drawing) {
            case "drawing":
                return <DrawingPage canvas={canvas} category={category} setDrawing={setDrawing}/>
            case "guessing":
                return <GuessingPage canvas={canvas} categories={categories} guess={guess} setGuess={setGuess} setDrawing={setDrawing}/>
            case "result":
                return <ResultPage canvas={canvas} modelGuess={modelGuess} guess={guess} restart={reset}/>
        }
    }

    return (
        <div className="App">
            <header className="App-header">
            {choosePage()}
            </header>
        </div>
    );
}

export default App;
