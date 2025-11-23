import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale/ko';
import { useLanguage } from '../contexts/LanguageContext';

const CustomDatePicker = ({ label, selected, onChange, ...props }) => {
  const { language } = useLanguage();

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
      <div className="custom-datepicker-wrapper">
        <DatePicker
          selected={selected ? new Date(selected) : null}
          onChange={(date) => {
            if (!date) {
              onChange({ target: { name: props.name, value: '' } });
              return;
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            onChange({ target: { name: props.name, value: formattedDate } });
          }}
          dateFormat="yyyy-MM-dd"
          className="custom-input"
          locale={language === 'ko' ? ko : undefined}
          placeholderText="yyyy-mm-dd"
          {...props}
        />
      </div>
      <style>{`
        .custom-datepicker-wrapper {
          width: 100%;
        }
        .custom-datepicker-wrapper .react-datepicker-wrapper {
          width: 100%;
        }
        .custom-input {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          outline: none;
          transition: var(--transition-fast);
          width: 100%;
          font-family: inherit;
          font-size: 1rem;
        }
        .custom-input:focus {
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
};

export default CustomDatePicker;
