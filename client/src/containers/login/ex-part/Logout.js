import { useNavigate } from "react-router-dom";
import ROUTES from '../../../navigations/Routes';
import { useAuth } from "../../../components/AuthContext";

const LogoutUser = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken();
    navigate(ROUTES.login.name, { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 3 * 1000);

};

export default LogoutUser;