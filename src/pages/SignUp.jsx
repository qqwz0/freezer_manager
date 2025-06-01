import React from 'react';
import { signup, login } from '../firebase/auth';
import AuthForm from 'auth/components/AuthForm';

export default function SignUp() {
  const handleSignup = async (email, password) => {
    const user = await signup(email, password);
    alert(`Успішно зареєстровано: ${user.email}`);

    const loggedInUser = await login(email, password);
  };

  return (
    <div className='flex flex-col items-center justify-center gap-3 h-full w-full'>
      <AuthForm
        text="Sign Up"
        onSubmit={handleSignup}
      />
    </div>
  );
}