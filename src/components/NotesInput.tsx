import React from 'react';
import './NotesInput.css';

interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const NotesInput: React.FC<NotesInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Grasienta",
  rows = 6,
  disabled = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="notes-container">
      <label htmlFor="notes">Sigues un petit dimoni</label>
      <textarea
        id="notes"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="notes-textarea"
        rows={rows}
        disabled={disabled}
      />
    </div>
  );
};

export default NotesInput;
