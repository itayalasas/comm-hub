import React from 'react';
import { Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import PublicAuthRouter from './components/auth/PublicAuthRouter';

export default function App() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const appId = searchParams.get('app_id') || import.meta.env.VITE_APP_ID || '';

  // Map path to form type
  const getFormType = (): 'login' | 'register' | 'reset-password' => {
    if (location.pathname.includes('register')) return 'register';
    if (location.pathname.includes('reset')) return 'reset-password';
    return 'login';
  };

  if (!appId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error de Configuración</h1>
          <p className="text-gray-600 mb-4">
            El parámetro <code className="bg-gray-100 px-2 py-1 rounded">app_id</code> es requerido en la URL.
          </p>
          <p className="text-sm text-gray-500">
            Ejemplo: <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              /login?app_id=xxx
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicAuthRouter
            appId={appId}
            formType="login"
          />
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthRouter
            appId={appId}
            formType="register"
          />
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicAuthRouter
            appId={appId}
            formType="reset-password"
          />
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
