import { Label, Select, TextInput, FileInput, Datepicker } from "flowbite-react";

const parseDMY = (str) => {
  if (!str) return undefined;
  const parts = str.includes('.') ? str.split('.') : str.split('/');
  if (parts.length !== 3) return undefined;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
};

export default function FormInput({ type, placeholder, value, onChange, required,minDate, children }) {
    return (
        <>
            {type === 'select' && (
                <Select id="countries" className="width-full" required={required} onChange={onChange}>
                    {children}
                </Select>
            )}

            {type === 'file' && (
                <FileInput
                    id="file"
                    onChange={onChange}
                    required={required}
                />
            )}

            {type === 'date' && (
                <Datepicker
                    value={value instanceof Date ? value : parseDMY(value)}
                    onChange={(date) => onChange({ target: { value: date } })}
                    required={required}
                    minDate={minDate}
                />
            )}

            {['select','file','date'].indexOf(type) < 0 && (
                <TextInput
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
            )}
        </>
    );
}
