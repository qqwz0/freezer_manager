import React from 'react'
import { Button } from "flowbite-react";
import { useState } from 'react'
import { FormInput } from './FormInput';
import { BaseModal } from './BaseModal';

function AddModal({ 
    show, 
    onClose, 
    onAdd, 
    title, 
    required = true,
    extraFields = null 
}) {
    const [name, setName] = useState("");
    const [extraValues, setExtraValues] = useState({});

    const handleAddClick = () => {
        if (!name) return;
        onAdd(name, extraValues); 

        setName("");
        setExtraValues({});

        onClose();
    };

    const handleExtraChange = (key, value) => {
        setExtraValues(prev => ({ ...prev, [key]: value }));
    };

    return (
        <BaseModal
            show={show}
            onClose={onClose}
            header={`Add ${title}`}
            footer={<Button onClick={handleAddClick} className='cursor-pointer'>Add</Button>}
        >
            <FormInput
                label={`Enter ${title} name:`}
                type="text"
                placeholder={`Enter ${title} name`}
                required={required}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {extraFields && 
                extraFields.map(f => (
                    <FormInput
                        key={f.key}
                        label={f.label}
                        type={f.type}
                        placeholder={f.placeholder}
                        required={f.required}
                        value={extraValues[f.key] || ""}
                        onChange={(e) => handleExtraChange(f.key, e.target.value)}
                    />
                ))
            }
        </BaseModal>
    )
}

export default AddModal