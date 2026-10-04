import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";

const useAuth = () => {
  const info = useContext(AuthContext);

  if (!info) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return info;
};

export default useAuth;
