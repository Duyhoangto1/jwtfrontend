import { useState, useEffect } from "react";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { loginUserRedux } from "../../../redux/actions/UserAction";

// Simple translations
const translations = {
  en: {
    title: "duyhoangto",
    desc: "This is a self-learning JWT full stack website by duyhoangto.",
    email: "Email address or phone number",
    password: "Password",
    login: "Log In",
    forgot: "Forgotten password?",
    create: "Create New Account",
    createPage: "Create a Page",
    for: "for a celebrity, brand or business.",
    theme: "Switch Theme",
    lang: "Language",
    emailError: "Invalid email or phone number!",
    required: "Required",
    passwordRequired: "Please input your password!",
  },
  vi: {
    title: "duyhoangto",
    desc: "Đây là website tự học JWT full stack của duyhoangto.",
    email: "Email hoặc số điện thoại",
    password: "Mật khẩu",
    login: "Đăng nhập",
    forgot: "Quên mật khẩu?",
    create: "Tạo tài khoản mới",
    createPage: "Tạo Trang",
    for: "cho người nổi tiếng, thương hiệu hoặc doanh nghiệp.",
    theme: "Đổi giao diện",
    lang: "Ngôn ngữ",
    emailError: "Email hoặc số điện thoại không hợp lệ!",
    required: "Bắt buộc nhập",
    passwordRequired: "Bắt buộc nhập mật khẩu!",
  },
};

const emailOrPhoneRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|\d{9,15})$/;

const Login = () => {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const history = useHistory();
  const t = translations[lang];
  const dispatch = useDispatch();
  const account = useSelector((state) => state.user.account);
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    return () => document.body.classList.remove("dark");
  }, [theme]);

  // Kiểm tra trạng thái đăng nhập từ sessionStorage khi component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem("account");
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.isAuthenticated) {
        history.push("/users");
      }
    }
  }, [history]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(emailOrPhoneRegex, t.emailError)
      .required(t.required),
    password: Yup.string().required(t.passwordRequired),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginUserRedux(values.email, values.password));
      // Không toast ở đây nữa!
      // if thành công thì chuyển trang
      history.push("/users");
    } catch (e) {
      // Không toast ở đây nữa!
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleCreateNewAccount = () => {
    history.push("/register");
  };

  // useEffect(() => {
  //   if (account && account?.auth === true) {
  //     history.push("/users");
  //   }
  // }, [account]);
  return (
    <div
      className={`min-vh-100 d-flex align-items-center justify-content-center p-3 ${
        theme === "dark" ? "bg-dark" : "bg-light"
      }`}
    >
      <div
        className={`d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 w-100 ${
          theme === "dark" ? "text-white" : "text-dark"
        }`}
        style={{ maxWidth: "900px" }}
      >
        {/* Left Section */}
        <div className="text-center text-md-start">
          <h1
            className="display-4 fw-bold mb-3"
            style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
          >
            {t.title}
          </h1>
          <p className="lead">{t.desc}</p>
        </div>

        {/* Right Section */}
        <div
          className={`card p-4 shadow-lg ${
            theme === "dark" ? "bg-dark" : "bg-light"
          }`}
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="d-flex justify-content-end mb-3">
            <select
              className="form-select form-select-sm bg-transparent border border-secondary"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
            >
              <option value="en">EN</option>
              <option value="vi">VI</option>
            </select>
            <button
              onClick={toggleTheme}
              className="btn btn-link text-dark ms-2"
              style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
            >
              {theme === "light" ? <MoonOutlined /> : <SunOutlined />}
            </button>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label>{t.email}</label>
                  <Field
                    as={Input}
                    name="email"
                    placeholder={t.email}
                    autoComplete="username"
                    style={{
                      background: theme === "dark" ? "#3a3a3a" : "#ffffff",
                      color: theme === "dark" ? "#ffffff" : "#000000",
                      borderColor: theme === "dark" ? "#3e4042" : "#dddfe2",
                    }}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label>{t.password}</label>
                  <Field
                    as={Input.Password}
                    name="password"
                    placeholder={t.password}
                    autoComplete="current-password"
                    style={{
                      background: theme === "dark" ? "#3a3a3a" : "#ffffff",
                      color: theme === "dark" ? "#ffffff" : "#000000",
                      borderColor: theme === "dark" ? "#3e4042" : "#dddfe2",
                    }}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="mb-3"
                  disabled={isSubmitting}
                  style={{
                    background: theme === "dark" ? "#1890ff" : "#1890ff",
                    borderColor: theme === "dark" ? "#1890ff" : "#1890ff",
                  }}
                >
                  {t.login}
                </Button>
                <a
                  href="#"
                  className="d-block text-center text-primary mb-3"
                  style={{ color: theme === "dark" ? "#1890ff" : "#1890ff" }}
                >
                  {t.forgot}
                </a>
                <hr className="border-secondary-subtle mb-3" />
                <Button
                  type="primary"
                  onClick={handleCreateNewAccount}
                  block
                  style={{
                    background: theme === "dark" ? "#52c41a" : "#52c41a",
                    borderColor: theme === "dark" ? "#52c41a" : "#52c41a",
                  }}
                >
                  {t.create}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
