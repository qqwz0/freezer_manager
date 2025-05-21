import { Label, Select, TextInput, FileInput } from "flowbite-react";

export default function FormInput({ type, placeholder, value, onChange, required, children }) {
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

            {type !== 'select' && type !== 'file' && (   
                <TextInput
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    // className="bg-gray-50 text-lg border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            )}
        </>
    );
}