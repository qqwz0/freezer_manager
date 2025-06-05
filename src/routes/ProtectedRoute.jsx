import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'auth';
import {LoadingScreen} from 'shared/ui';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <>
    <LoadingScreen />
    <p>hello</p>
    </>
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
