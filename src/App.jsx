import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './routes/ProtectedRoute';
import AppRoutes from './routes/AppRoutes';
 
export default function App() {
  return (
    <Router>  {/* Remove basename completely */}
      <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}