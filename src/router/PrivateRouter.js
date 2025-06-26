import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
const PrivateRoute = (props) => {
  const user = useSelector((state) => state.user.account);
  const history = useHistory();

  useEffect(() => {
    if (!user || !user.isAuthenticated) {
      // Kiểm tra isAuthenticated
      history.push("/login");
    }
  }, [user, history]);

  if (!user || !user.isAuthenticated) {
    return null; // Tránh render khi không có quyền
  }

  return (
    <>
      <Route path={props.path} component={props.component} />
    </>
  );
};

export default PrivateRoute;
