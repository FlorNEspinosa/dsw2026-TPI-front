import { createContext, useState } from 'react';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';
import { logout } from '../services/logout';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !['ADMINISTRADOR', 'PACIENTE'].includes(role)) {
      return null;
    }

    return { token, role };
  });

  const singout = async () => {
    try {
      await logout();
    } catch (error) {
      if (error.response?.status !== 401) {
        return {
          error:
            error.response?.data?.message ||
            'No se pudo cerrar la sesión. Volvé a intentar.',
        };
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setSession(null);

    return { error: null };
  };

  const setAuthSession = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setSession({ token, role });
  };

  const singinAdmin = async (email, password) => {
    const { data, error } = await loginAdmin(email, password);

    if (error) {
      return { error };
    }

    setAuthSession(data.token, data.role);

    return { error: null };
  };

  const singinPatient = async (email, dni) => {
    const { data, error } = await loginPatient(email, dni);

    if (error) {
      return { error };
    }

    setAuthSession(data.token, data.role);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session),
        role: session?.role ?? null,
        singin: singinAdmin,
        singinAdmin,
        singinPatient,
        singout,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
