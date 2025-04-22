import React from 'react';
import { signup } from '../firebase/config';
import AuthForm from '../components/AuthForm';

export default function SignUp() {
  const handleSignup = async (email, password) => {
    const user = await signup(email, password);
    alert(`Успішно зареєстровано: ${user.email}`);
  };

  return (
    <AuthForm
      text="Sign Up"
      onSubmit={handleSignup}
    />
  );
}