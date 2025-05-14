import React, { useState, useEffect } from 'react';
import { Button }from 'flowbite-react';

import { FormInput } from 'components/common/Form';
import { BaseModal } from 'components/common/Modal';
import { ActionButton } from 'components/common/Button'

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

    useEffect(() => {
    const initialValues = {};
    fields.forEach(field => {
        initialValues[field.key] = freezerData[field.key] !== undefined ? freezerData[field.key] : (field.required ? '' : null);
    });
    setValues(initialValues);
    }, [freezerData, show, fields]);

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value}))
    }

    const handleSave = () => {
        onEdit({...values, id: freezerData.id});
        onClose();
    }   

    return (
        <BaseModal
            show={show}
            onClose={onClose}
            header={`Edit ${title}`}
            footer={<ActionButton onClick={handleSave} action="submit">Save</ActionButton>}
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