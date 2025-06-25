import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import Nav from "./components/Navigation/Nav";
import AppRouter from "./router/AppRouter";
import { ToastContainer } from "react-toastify";
import _ from "lodash";
function App() {
  const [account, setAccount] = useState({});
  useEffect(() => {
    let session = sessionStorage.getItem("account");
    if (session) {
      setAccount(JSON.parse(session));
    }
  }, []);
  return (
    <BrowserRouter>
      <div className="App app-container">
        <header className="App-header">
          {account && !_.isEmpty(account) && account.isAuthenticated && <Nav />}
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
      >
        {" "}
      </ToastContainer>
    </BrowserRouter>
  );
}
export default App;
