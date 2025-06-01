import { Label, Select, TextInput, FileInput, Datepicker } from "flowbite-react";
import { useId } from 'react';

const parseDMY = (str) => {
  if (!str) return undefined;
  const parts = str.includes('.') ? str.split('.') : str.split('/');
  if (parts.length !== 3) return undefined;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
};

export default function FormInput({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  required,
  minDate, 
  children,
  label,  // New label prop
  id,     // New id prop for accessibility
  error
}) {
  // Generate unique ID if not provided
  const generatedId = useId();
  const inputId = id || generatedId;

  // Normalize values to prevent controlled/uncontrolled switching
  const normalizedValue = value ?? '';
  const normalizedDateValue = value || null;

  return (
    <>
        <Label 
          htmlFor={inputId} 
          className="block mb-2 text-sm font-medium text-gray-700"
        >{label}</Label>
      
      {type === 'select' && (
        <Select 
          id={inputId} 
          required={required} 
          value={normalizedValue}
          onChange={onChange}
          className="w-full"
        >
          {children}
        </Select>
      )}

      {type === 'file' && (
        <FileInput
          id={inputId}
          onChange={onChange}
          required={required}
          className="w-full"
        />
      )}

      {type === 'date' && (
        <Datepicker
          id={inputId}
          value={normalizedDateValue}
          onChange={(date) => onChange({ target: { value: date } })}
          required={required}
          minDate={minDate}
          className="w-full"
        />
      )}

      {['select','file','date'].indexOf(type) < 0 && (
        <TextInput
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={normalizedValue}
          onChange={onChange}
          required={required}
          className="w-full"
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
}