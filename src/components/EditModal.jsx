import React from 'react'
import { Button } from "flowbite-react";
import { useState, useEffect } from 'react'
import { FormInput } from './FormInput';
import { BaseModal } from './BaseModal';

function EditModal({ 
    show, 
    onClose, 
    onEdit, 
    title, 
    fields = [],  // [{ key, label, type, placeholder, required }]
    freezerData = {},
}) {
    const [values, setValues] = useState({});

    useEffect(() => {
        setValues(freezerData)
    }, [freezerData, show])

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value}))
    }

    const handleSave = () => {
        onEdit(values);
        onClose();
    }   

    return (
        <BaseModal
            show={show}
            onClose={onClose}
            header={`Edit ${title}`}
            footer={<Button onClick={handleSave} className='cursor-pointer'>Save</Button>}
        >
            {fields.map(f => (
                <div key={f.key} className="mb-4">
                    <label className="block mb-1 font-medium">
                        {f.label}
                    </label>
                    <FormInput
                    type={f.type}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={values[f.key] ?? ''}
                    onChange={e => handleChange(f.key, e.target.value)}
                    />
              </div>
            ))
            }
        </BaseModal>
    )
}

export default EditModal