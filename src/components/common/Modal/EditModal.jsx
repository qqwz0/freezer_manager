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
    // Initialize values from freezerData and default null for optional
    const initial = {};
    fields.forEach(f => { 
      if (f.type === 'file') {
        // no initial file
        initial[f.key] = null;
      } else if (f.type === 'checkbox') {
        initial[f.key] = freezerData[f.key] ?? false;
      } else {
        initial[f.key] = freezerData[f.key] ?? (f.required ? '' : null);
      }
    });
    setValues(initial);
  }, [freezerData, show, fields]);

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // pass values and include id for parent
    onEdit({ ...values, id: freezerData.id });
    onClose();
  };

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      header={`Edit ${title}`}
      footer={<ActionButton onClick={handleSave} action="submit">Save</ActionButton>}
    >
      {fields.map(f => (
        <div key={f.key} className="mb-4">
          <label className="block mb-1 font-medium">{f.label}</label>

          {f.type === 'file' ? (
            <input
              type="file"
              accept="image/*"
              onChange={e => handleChange(f.key, e.target.files[0])}
            />
          ) : f.type === 'checkbox' ? (
            <FormCheckbox
              checked={values[f.key]}
              onChange={e => handleChange(f.key, e.target.checked)}
            >{f.label}</FormCheckbox>
          ) : (
            <FormInput
              type={f.type}
              placeholder={f.placeholder}
              required={f.required}
              value={values[f.key] ?? ''}
              onChange={e => handleChange(f.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </BaseModal>
  );
}

export default EditModal