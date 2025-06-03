import React from 'react';
import { signup, login } from '../services/auth';
import {AuthForm} from 'auth/components';
import { Header } from 'shared/ui';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignUp() {
  const handleSignup = async (email, password) => {
    const user = await signup(email, password);
    toast.success(`Успішно зареєстровано: ${user.email}`);
    await login(email, password);
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      <Header />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 dark:from-indigo-500/30 dark:to-pink-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join us today and start your journey
            </p>
          </div>

          {/* Auth form container */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
            <AuthForm
              text="Sign Up"
              onSubmit={handleSignup}
            />
            
            {/* Additional links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}