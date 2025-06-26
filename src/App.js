import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import Nav from "./components/Navigation/Nav";
import AppRouter from "./router/AppRouter";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { handleRefresh } from "./redux/actions/UserAction";

function App() {
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(handleRefresh());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="App app-container">
        <header className="App-header">
          {account.isAuthenticated && <Nav />}
          <AppRouter />
        </header>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
