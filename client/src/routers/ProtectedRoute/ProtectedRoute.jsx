import { Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Loader from "../../components/Loader/Loader";
import useRole from "../../hooks/useRole/useRole";

const ProtectedRoute = ({ children }) => {
  const { user, isUserPending, loggedOut } = useAuth();
  const { isRoleLoading, isAdmin, isEmployee } = useRole();
  const location = useLocation();

  if (isUserPending || isRoleLoading) {
    return <Loader />;
  }

  if (!user || (!isAdmin && !isEmployee)) {
    loggedOut();
    return <Navigate to="/auth/sign-in" state={location?.pathname} replace />;
  }

  return children;
};

export default ProtectedRoute;
