import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Users.scss";
const Users = (props) => {
  const history = useHistory();
  useEffect(() => {
    let session = sessionStorage.getItem("account");
    if (!session) {
      history.push("/login");
    }
  }, []);
  return <div>manager user</div>;
};

export default Users;
