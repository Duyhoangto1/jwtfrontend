import { useEffect, useState } from "react";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { registerNewUser } from "../../../services/userService";

const translations = {
  en: {
    title: "Register",
    desc: "This is a self-learning JWT full stack website by duyhoangto.",
    email: "Email address",
    phone: "Phone number",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    register: "Register",
    login: "Already have an account? Log In",
  },
  vi: {
    title: "Đăng ký",
    desc: "Đây là website tự học JWT full stack của duyhoangto.",
    email: "Địa chỉ email",
    phone: "Số điện thoại",
    username: "Tên người dùng",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    register: "Đăng ký",
    login: "Đã có tài khoản? Đăng nhập",
  },
};

const Register = () => {
  const [lang, setLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const history = useHistory();
  const t = translations[lang];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        emailRegex,
        lang === "vi" ? "Email không hợp lệ" : "Invalid email"
      )
      .required(lang === "vi" ? "Bắt buộc nhập email" : "Required"),
    phone: Yup.string().required(
      lang === "vi" ? "Bắt buộc nhập số điện thoại" : "Required"
    ),
    username: Yup.string().required(
      lang === "vi" ? "Bắt buộc nhập tên người dùng" : "Required"
    ),
    password: Yup.string()
      .min(6, lang === "vi" ? "Tối thiểu 6 ký tự" : "Min 6 chars")
      .required(lang === "vi" ? "Bắt buộc nhập mật khẩu" : "Required"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        lang === "vi" ? "Mật khẩu không khớp!" : "Passwords do not match!"
      )
      .required(lang === "vi" ? "Bắt buộc xác nhận mật khẩu" : "Required"),
  });

  const handleLoginRedirect = () => {
    history.push("/login");
  };

  // Trong component (e.g., Register.tsx)
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await registerNewUser(
        values.email,
        values.phone,
        values.username,
        values.password
      );
      toast.success("Register success!");
      setSubmitting(false);
      resetForm();
      console.log("Response:", response.data);
      history.push("/login");
    } catch (e) {
      console.error("Error:", e);
      toast.error("Register failed!");
      if (e.response) {
        console.error("Server response:", e.response.data);
      }
    }
  };

  return (
    <div
      className={`min-vh-100 d-flex align-items-center justify-content-center p-3 ${
        isDarkMode ? "bg-dark" : "bg-white"
      }`}
    >
      <div
        className={`d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 w-100 ${
          isDarkMode ? "text-white" : "text-dark"
        }`}
        style={{ maxWidth: "900px" }}
      >
        {/* Left Section */}
        <div className="text-center text-md-start">
          <h1
            className="display-4 fw-bold mb-3"
            style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          >
            {t.title}
          </h1>
          <p className="lead">{t.desc}</p>
        </div>

        {/* Right Section */}
        <div
          className={`card p-4 shadow-lg ${
            isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
          }`}
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="d-flex justify-content-end mb-3">
            <select
              className="form-select form-select-sm bg-transparent border border-secondary-subtle rounded-2"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en" className="bg-light text-dark">
                EN
              </option>
              <option value="vi" className="bg-light text-dark">
                VI
              </option>
            </select>
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="btn btn-link text-dark ms-2"
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
            >
              {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            </button>
          </div>
          <h2
            className="text-center mb-4 display-6 fw-bold"
            style={{
              color: isDarkMode ? "#ffffff" : "#000000",
              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {t.title}
          </h2>
          <Formik
            initialValues={{
              email: "",
              phone: "",
              username: "",
              password: "",
              confirmPassword: "",
            }}
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
                    autoComplete="email"
                    style={{
                      background: isDarkMode ? "#3a3a3a" : "#ffffff",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      borderColor: isDarkMode ? "#3e4042" : "#dddfe2",
                    }}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label>{t.phone}</label>
                  <Field
                    as={Input}
                    name="phone"
                    placeholder={t.phone}
                    autoComplete="tel"
                    style={{
                      background: isDarkMode ? "#3a3a3a" : "#ffffff",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      borderColor: isDarkMode ? "#3e4042" : "#dddfe2",
                    }}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label>{t.username}</label>
                  <Field
                    as={Input}
                    name="username"
                    placeholder={t.username}
                    autoComplete="username"
                    style={{
                      background: isDarkMode ? "#3a3a3a" : "#ffffff",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      borderColor: isDarkMode ? "#3e4042" : "#dddfe2",
                    }}
                  />
                  <ErrorMessage
                    name="username"
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
                    autoComplete="new-password"
                    style={{
                      background: isDarkMode ? "#3a3a3a" : "#ffffff",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      borderColor: isDarkMode ? "#3e4042" : "#dddfe2",
                    }}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label>{t.confirmPassword}</label>
                  <Field
                    as={Input.Password}
                    name="confirmPassword"
                    placeholder={t.confirmPassword}
                    autoComplete="new-password"
                    style={{
                      background: isDarkMode ? "#3a3a3a" : "#ffffff",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      borderColor: isDarkMode ? "#3e4042" : "#dddfe2",
                    }}
                  />
                  <ErrorMessage
                    name="confirmPassword"
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
                    background: isDarkMode ? "#4599ff" : "#1877f2",
                    borderColor: isDarkMode ? "#4599ff" : "#1877f2",
                  }}
                >
                  {t.register}
                </Button>
                <p
                  className="text-center text-muted mb-0"
                  style={{ color: isDarkMode ? "#adb5bd" : "#6c757d" }}
                >
                  <a
                    href="#"
                    onClick={handleLoginRedirect}
                    className="text-primary"
                    style={{ color: isDarkMode ? "#0d6efd" : "#0d6efd" }}
                  >
                    {t.login}
                  </a>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
