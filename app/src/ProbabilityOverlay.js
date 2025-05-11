import React from "react";
import "./ProbabilityOverlay.css";

const ProbabilityOverlay = ({ probabilities }) => {
    if (probabilities.length === 0) return null;

    return (
        <div className="probability-overlay">
            <h4>Top Predictions</h4>
            <ul className="probability-list">
                {probabilities.map(([label, prob]) => (
                    <li key={label} className="probability-item">
                        <div className="probability-label">{label}</div>
                        <div className="probability-bar-container">
                            <div
                                className="probability-bar"
                                style={{ width: `${(prob * 100).toFixed(2)}%` }}
                            ></div>
                            <div className="probability-percentage">
                                {(prob * 100).toFixed(2)}%
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProbabilityOverlay;
