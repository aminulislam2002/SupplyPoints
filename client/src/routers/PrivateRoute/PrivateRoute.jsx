import { Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Loader from "../../components/Loader/Loader";

const PrivateRoute = ({ children }) => {
  const { user, isUserPending } = useAuth();
  const location = useLocation();

  if (isUserPending) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" state={location?.pathname} replace />;
  }

  return children;
};

export default PrivateRoute;

