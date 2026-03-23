import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
