import { createContext, useContext, useState } from "react";

// Tạo context
const UserContext = createContext();

// Provider để bọc app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Hàm login: lưu user vào state
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Lưu vào localStorage
  };

  // Hàm logout: xóa user khỏi state
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Xóa từ localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để dùng context
export const useUser = () => useContext(UserContext);
