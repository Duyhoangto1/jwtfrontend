import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./Nav.scss";
import { AppContext } from "../../contexts/AppContext";

function Nav() {
  const { theme, setTheme, lang, setLang } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const history = useHistory();

  // Kiểm tra trạng thái đăng nhập từ sessionStorage
  useEffect(() => {
    const session = sessionStorage.getItem("account");
    if (session) {
      const account = JSON.parse(session);
      setIsLoggedIn(account.isAuthenticated);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    history.push("/login");
  };
  const handleRegister = () => {
    history.push("/register");
  };
  const handleLogout = () => {
    setShowDropdown(false);
    sessionStorage.removeItem("account");
    setIsLoggedIn(false);
    history.push("/");
  };

  const handleProfile = () => {
    setShowDropdown(false);
    history.push("/profile");
  };

  return (
    <nav className="topnav">
      <div className="nav-left">
        <NavLink exact to="/home" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/news" activeClassName="active">
          News
        </NavLink>
        <NavLink to="/contact" activeClassName="active">
          Contact
        </NavLink>
        <NavLink to="/about" activeClassName="active">
          About
        </NavLink>
      </div>
      <div className="nav-right">
        <button
          className="theme-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <select
          className="lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="vi">VI</option>
        </select>
        {!isLoggedIn ? (
          <>
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
            <button className="login-btn" onClick={handleRegister}>
              Sign Up
            </button>
          </>
        ) : (
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="setting-btn"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              ⚙️ Setting
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleProfile}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
