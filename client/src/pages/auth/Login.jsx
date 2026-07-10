import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ==========================
  // Dark Mode
  // ==========================

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme") ===
        "dark"
    );

  // Apply / persist theme. Login lives outside <Layout>, so we
  // still need this here to keep the `dark` class on <html> in
  // sync in case this is the first page the user lands on.

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");

    } else {

      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");

    }

  }, [darkMode]);

  const toggleTheme = () => {

    setDarkMode((prev) => !prev);

  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data } = await api.post(
      "/auth/login",
      formData
    );

    // Save JWT Token
    localStorage.setItem(
      "token",
      data.token
    );

    // Save Logged-in User
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    toast.success(
      `Welcome ${data.user.name}!`
    );

    navigate("/dashboard");

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Login Failed!"
    );

  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-slate-900 dark:via-slate-950 dark:to-black flex items-center justify-center px-4 transition-colors duration-300">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative">

        {/* Theme Toggle */}

        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300"
          aria-label="Toggle dark mode"
        >

          {darkMode ? <FaSun /> : <FaMoon />}

        </button>

        {/* Logo */}

        <div className="flex justify-center mb-5">

          <div className="bg-white p-5 rounded-full shadow-lg">

            <FaRocket className="text-4xl text-blue-600" />

          </div>

        </div>

        <h1 className="text-4xl font-extrabold text-center text-white">

          Trello Lite

        </h1>

        <p className="text-center text-blue-100 mt-2 mb-8">

          Welcome back! Login to continue.

        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="text-white font-medium">

              Email

            </label>

            <div className="relative mt-2">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="text-white font-medium">

              Password

            </label>

            <div className="relative mt-2">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >

                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>

          </div>

        {/* Forgot Password */}

<div className="flex justify-end">

  <Link
    to="/forgot-password"
    className="text-yellow-300 hover:text-yellow-200 font-semibold text-sm"
  >

    Forgot Password?

  </Link>

</div>

{/* Login Button */}

<button
  type="submit"
  className="w-full bg-white dark:bg-slate-100 text-blue-700 py-3 rounded-xl font-bold text-lg hover:bg-blue-100 transition-all duration-300 shadow-lg"
>

  Login

</button>

        </form>

        <p className="text-center text-white mt-8">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-bold text-yellow-300 hover:text-yellow-200"
          >

            Register

          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;