import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // Double-check session token exists and is valid format (64 hex chars or JWT)
  const token = sessionStorage.getItem("portfolio_session");
  const hasValidToken =
    token &&
    (/^[a-f0-9]{64}$/.test(token) ||
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token));

  if (!isAuthenticated || !hasValidToken) {
    // Clear any stale/tampered session data
    sessionStorage.removeItem("portfolio_session");
    return <Navigate to="/admin" replace />;
  }

  return children;
}
