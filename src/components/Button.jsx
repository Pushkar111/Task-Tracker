import React from "react";

export const Button = ({ bgcolor, text, onClick }) => {
    return (
        <button style={{ backgroundColor: bgcolor }} className="btn" onClick={onClick}>
            {text}
        </button>
    );
};
