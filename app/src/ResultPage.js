import React from "react";
import "./ResultPage.css";

const ResultPage = ({ category, modelGuess, image, onClose }) => {
    return (
        <div
            id="popup-overlay"
            onClick={(e) => {
                if (e.target.id === "popup-overlay") onClose();
            }}
        >
            <div className="popup-container">
                <h2 className="popup-title">Results</h2>
                <div className="popup-image-container">
                    {image && (
                        <img
                            src={image}
                            alt="Your Drawing"
                            className="popup-image"
                        />
                    )}
                </div>
                <div className="popup-details">
                    <div className="popup-detail">
                        <p>
                            <strong>Category:</strong> {category}
                        </p>
                    </div>
                    <div className="popup-detail">
                        <p>
                            <strong>Computer's Guess:</strong>{" "}
                            {modelGuess || "No guess"}
                        </p>
                    </div>
                </div>
                <button className="popup-close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ResultPage;
