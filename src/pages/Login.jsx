import React from 'react'
import { login } from '../firebase/auth'
import AuthForm from 'auth/components/AuthForm';

function Login() {
  const handleLogin = async (email, password) => {
    try {
      const user = await login(email, password);
      alert(`Успішний вхід: ${user.email}`);
    } catch (error) {
      alert(`Помилка входу: ${error.message}`);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-3 h-full w-full'>
      <AuthForm
        text="Login"
        onSubmit={handleLogin}
      />
    </div>
  )
}

export default Login

