import React from 'react';
import { Button } from '@mui/material'
import Canvas from './Canvas'
import categoriesFile from './categories.txt'
import './App.css';

function App() {
  const canvasRef = React.useRef(null)
  const [categories, setCategories] = React.useState(null)
  const [category, setCategory] = React.useState(null)

  React.useEffect(() => {
    try {
      fetch(categoriesFile).then(res => res.text())
        .then(res => {setCategories(res.split("\n"))})
    } catch (error) {
      alert("Error: " + error.message);
    }
  }, [])

  const newCategory = () => {
    if (categories)
      setCategory(categories[Math.floor(Math.random() * categories.length)])
  }

  if (!category) newCategory()

  const sendCanvas = async () => {
    const canvas = canvasRef.current;
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

  return (
    <div className="App">
      <header className="App-header">
        <p>Draw a {category || "..."}</p>
        <Canvas canvasRef={canvasRef}/>
        <Button onClick={sendCanvas}>Send Canvas</Button>
        <Button onClick={newCategory}>New Category</Button>
      </header>
    </div>
  );
}

export default App;
