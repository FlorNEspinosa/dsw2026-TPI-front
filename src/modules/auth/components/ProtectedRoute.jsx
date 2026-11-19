import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, redirectTo = '/login', requiredRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const homePath = role === 'ADMINISTRADOR' ? '/admin/home' : '/';

    return <Navigate to={homePath} replace />;
  }

  return children;
}

export default ProtectedRoute;
