import React, { useState } from 'react';
import { FormInput } from '../components/FormInput';
import { SubmitButton } from '../components/SubmitButton';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ text, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await onSubmit(email, password);
      navigate('/');
    } catch (error) {
      console.error('Error during authentication:', error);
      alert(`Authentication failed: ${error.message}`);
    } finally {
      console.log('Loading finished');
    } 
  };

  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <h2 className='font-bold text-4xl'>{text}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <SubmitButton>{text}</SubmitButton>
      </form>
    </div>
  );
}