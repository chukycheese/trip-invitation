import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', width, height, className = '', ...props }) => {
    const baseStyle = {
        borderRadius: 'var(--radius-full)',
        fontWeight: '600',
        transition: 'var(--transition-fast)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        border: 'none',
    };

    const sizes = {
        small: {
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
        },
        medium: {
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
        },
        large: {
            padding: '1rem 2.5rem',
            fontSize: '1.25rem',
        }
    };

    const variants = {
        primary: {
            background: 'var(--gradient-primary)',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(244, 63, 94, 0.4), 0 8px 10px -6px rgba(244, 63, 94, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
        },
        secondary: {
            background: 'rgba(0, 0, 0, 0.05)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-muted)',
        }
    };

    const combinedStyle = {
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...(width && { width }),
        ...(height && { height }),
        ...props.style
    };

    return (
        <button
            className={className}
            style={combinedStyle}
            onMouseOver={(e) => {
                if (variant === 'primary') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(244, 63, 94, 0.5), 0 10px 10px -5px rgba(244, 63, 94, 0.2)';
                }
            }}
            onMouseOut={(e) => {
                if (variant === 'primary') {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(244, 63, 94, 0.4), 0 8px 10px -6px rgba(244, 63, 94, 0.1)';
                }
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
