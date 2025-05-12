import React from "react";
import { Button } from "@mui/material";

const CategoryChoicePage = ({
    categories,
    categoryDifficulties,
    onCategorySelect,
}) => {
    const [choices, setChoices] = React.useState([]);

    React.useEffect(() => {
        if (categories && categoryDifficulties) {
            const easy = categories.filter(
                (_, index) => categoryDifficulties[index] === "easy"
            );
            const medium = categories.filter(
                (_, index) => categoryDifficulties[index] === "medium"
            );
            const hard = categories.filter(
                (_, index) => categoryDifficulties[index] === "hard"
            );

            const getRandomFrom = (arr) =>
                arr.length > 0
                    ? arr[Math.floor(Math.random() * arr.length)]
                    : null;

            const selectedChoices = [
                getRandomFrom(easy),
                getRandomFrom(medium),
                getRandomFrom(hard),
            ].filter(Boolean);

            setChoices(selectedChoices);
        }
    }, [categories, categoryDifficulties]);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Choose a Category</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                {["easy", "medium", "hard"].map((difficulty, i) => (
                    <div key={difficulty}>
                        <h3>
                            {difficulty.charAt(0).toUpperCase() +
                                difficulty.slice(1)}
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
                            {choices[i] && (
                                <Button
                                    key={choices[i]}
                                    variant="contained"
                                    onClick={() => onCategorySelect(choices[i])}
                                >
                                    {choices[i]}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryChoicePage;
