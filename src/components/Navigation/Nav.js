import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./Nav.scss";
import { AppContext } from "../../contexts/AppContext";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserRedux } from "../../redux/actions/UserAction";

function Nav() {
  const { theme, setTheme, lang, setLang } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();

  // Lấy trạng thái đăng nhập từ Redux
  const isLoggedIn = useSelector((state) => state.user.account.isAuthenticated);

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
    dispatch(logoutUserRedux());
    history.push("/login");
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
        <NavLink to="/users" activeClassName="active">
          Users
        </NavLink>
        <NavLink to="/project" activeClassName="active">
          Project
        </NavLink>
        <NavLink to="/roles" activeClassName="active">
          Roles
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
