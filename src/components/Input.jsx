import React from 'react';

const Input = ({ label, ...props }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            {label && (
                <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--color-text-muted)'
                }}>
                    {label}
                </label>
            )}
            <input
                style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    outline: 'none',
                    transition: 'var(--transition-fast)',
                    width: '100%',
                    ...props.style
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                {...props}
            />
        </div>
    );
};

export default Input;
