import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="flex items-center justify-center h-screen">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            Loading freezers...
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
