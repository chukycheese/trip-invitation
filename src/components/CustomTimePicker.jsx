import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CustomTimePicker = ({ value, onChange, ...props }) => {
    // Convert time string (HH:mm) to Date object
    const timeToDate = (timeStr) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date;
    };

    // Convert Date object to time string (HH:mm)
    const dateToTime = (date) => {
        if (!date) return '';
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleChange = (date) => {
        const timeString = dateToTime(date);
        onChange({ target: { value: timeString } });
    };

    return (
        <div className="custom-timepicker-wrapper">
            <DatePicker
                selected={timeToDate(value)}
                onChange={handleChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
                timeCaption=""
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                className="custom-time-input"
                placeholderText="--:--"
                {...props}
            />
            <style>{`
                .custom-timepicker-wrapper {
                    width: 100%;
                }
                .custom-timepicker-wrapper .react-datepicker-wrapper {
                    width: 100%;
                }
                .custom-time-input {
                    width: 100%;
                    height: 43px;
                    padding: 0 0.5rem;
                    border-radius: var(--radius-sm);
                    background: rgba(255, 255, 255, 0.8);
                    border: 1px solid var(--color-border);
                    color: var(--color-text);
                    outline: none;
                    font-family: inherit;
                    cursor: pointer;
                }
                .custom-time-input:focus {
                    border-color: var(--color-primary);
                }
                .react-datepicker__time-container {
                    width: 100px;
                }
                .react-datepicker__time-list {
                    padding: 0;
                }
                .react-datepicker__time-list-item {
                    padding: 5px 10px;
                }
                .react-datepicker__time-list-item:hover {
                    background-color: rgba(244, 63, 94, 0.1);
                }
                .react-datepicker__time-list-item--selected {
                    background-color: var(--color-primary) !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
};

export default CustomTimePicker;
