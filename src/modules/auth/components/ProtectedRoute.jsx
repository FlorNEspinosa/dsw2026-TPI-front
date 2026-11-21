import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute({
  children,
  redirectTo = '/login',
  allowedRoles = [],
}) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const homePath = role === 'ADMINISTRADOR' ? '/admin/home' : '/';

    return <Navigate to={homePath} replace />;
  }

  return children;
}

export default ProtectedRoute;
