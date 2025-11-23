import React from 'react';

const Card = ({ children, className = '', style = {}, ...props }) => {
    return (
        <div
            className={`glass-panel ${className}`}
            style={{
                padding: '1.5rem',
                wordBreak: 'keep-all',
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
