import React from "react";
import { Button } from "@mui/material";

const CategoryChoicePage = ({ categories, onCategorySelect }) => {
    const [choices, setChoices] = React.useState([]);

    React.useEffect(() => {
        if (categories) {
            const shuffled = [...categories].sort(() => 0.5 - Math.random());
            setChoices(shuffled.slice(0, 3));
        }
    }, [categories]);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Choose a Category</h2>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                }}
            >
                {choices.map((choice) => (
                    <Button
                        key={choice}
                        variant="contained"
                        onClick={() => onCategorySelect(choice)}
                    >
                        {choice}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CategoryChoicePage;
