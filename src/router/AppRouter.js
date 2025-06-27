import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../components/(auth)/Login/Login";
import Register from "../components/(auth)/Register/Register";
import Users from "../components/ManageUsers/Users";
import PrivateRoute from "./PrivateRouter"; // Đảm bảo file này tồn tại
import Project from "../components/Projects/Project";
import Profile from "../components/(auth)/Profile/Profile";
import Roles from "../components/(auth)/Roles/Roles";

// Các component page
function Home() {
  return <p>Hello world React with Hoi Dan IT</p>;
}

const AppRouter = (props) => (
  <Switch>
    <Route path="/home" component={Home} />

    <Route path="/" exact component={Home} />
    <Route path="/login" component={Login} />
    <PrivateRoute path="/users" component={Users} />
    <PrivateRoute path="/project" component={Project} />
    <PrivateRoute path="/profile" component={Profile} />
    <PrivateRoute path="/roles" component={Roles} />
    <Route path="/register" component={Register} />
    <Route path="*">404 not found</Route>
  </Switch>
);

export default AppRouter;
