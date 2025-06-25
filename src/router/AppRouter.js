import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../components/(auth)/Login/Login";
import Register from "../components/(auth)/Register/Register";
import Users from "../components/ManageUsers/Users";

// Các component page
function Home() {
  return <p>Hello world React with Hoi Dan IT</p>;
}
function News() {
  return <p>News Page</p>;
}
function Contact() {
  return <p>Contact Page</p>;
}
function About() {
  return <p>About Page</p>;
}

const AppRouter = () => (
  <Switch>
    <Route path="/home" component={Home} />
    <Route path="/news" component={News} />
    <Route path="/contact" component={Contact} />
    <Route path="/about" component={About} />
    <Route path="/" exact component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/users" component={Users} />
    <Route path="/register" component={Register} />
    <Route path="*">404 not found</Route>
  </Switch>
);

export default AppRouter;
