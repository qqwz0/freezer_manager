import React from 'react'
import { login } from '../firebase/auth'
import AuthForm from '../components/AuthForm'

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
    <AuthForm
      text="Login"
      onSubmit={handleLogin}
    />
  )
}

export default Login

