// TextBox.jsx
import React, { useEffect, useRef } from 'react';

const TextBox = ({ text, value, onChange, columnIndex, top_offset }) => {
    const inputRef = useRef();

    // Handle keydown events to increase/decrease by 50
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault(); // Prevent the default behavior
            const newValue = parseInt(value, 10) + 50; // Increase by 50
            onChange(columnIndex, newValue); // Call the onChange function
        } else if (event.key === 'ArrowDown') {
            event.preventDefault(); // Prevent the default behavior
            const newValue = parseInt(value, 10) - 50; // Decrease by 50
            onChange(columnIndex, newValue); // Call the onChange function
        }
    };

    return (
        <div style={{
            position: 'absolute',
            left: '10px',
            top: top_offset,
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            zIndex: 1000 // Ensure it's above other elements
        }}>
            {text}
            <input
                ref={inputRef}
                type="number"
                value={value} // Use value prop to control the input
                onChange={(e) => onChange(columnIndex, e.target.value)} // Handle input change
                onKeyDown={handleKeyDown} // Handle keydown events
                style={{ marginLeft: '5px' }} // Space between label and input
            />
        </div>
    );
};

export default TextBox;
