import { Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Loader from "../../components/Loader/Loader";
import useRole from "../../hooks/useRole/useRole";

const AdminRoute = ({ children }) => {
  const { user, loggedOut, isUserPending } = useAuth();
  const { isRoleLoading, isAdmin } = useRole();
  const location = useLocation();

  if (isUserPending || isRoleLoading) {
    return <Loader />;
  }

  if (user && !isAdmin) {
    loggedOut();
    return <Navigate to="/auth/sign-in" state={location?.pathname} replace />;
  }

  return children;
};

export default AdminRoute;
