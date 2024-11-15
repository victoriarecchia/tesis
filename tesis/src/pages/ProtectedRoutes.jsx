import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children; 
};

export default ProtectedRoute;