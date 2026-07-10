import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import {
  FaMoon,
  FaSun,
} from "react-icons/fa";

import api from "../../services/api";
import {
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaColumns,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

function Layout() {

  const navigate = useNavigate();

  const location = useLocation();

  // Logged-in User
  const user = JSON.parse(
    localStorage.getItem("user")
  );
  const [
  unreadCount,
  setUnreadCount,
] = useState(0);
const [darkMode, setDarkMode] =
  useState(
    localStorage.getItem("theme") ===
      "dark"
  );

useEffect(() => {
  fetchNotifications();
}, []);

// ==========================
// Apply / Persist Theme
// ==========================
// Runs whenever darkMode changes: toggles the `dark` class on
// <html> (so Tailwind's `dark:` variants work app-wide) and
// saves the preference so it survives a refresh.

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

const fetchNotifications = async () => {

  try {

    const { data } = await api.get(
      "/notifications"
    );

    const unread = data.filter(
      (notification) =>
        !notification.isRead
    ).length;

    setUnreadCount(unread);

  } catch (error) {

    console.log(error);

  }

};

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
    {
    
  name: "Kanban",
  path: "/kanban",
  icon: <FaColumns />,
},

{
  name: "Notifications",
  path: "/notifications",
  icon: <FaBell />,
},

{
  name: "Profile",
  path: "/profile",
  icon: <FaUserCircle />,
},
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">

      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">

        {/* Logo */}

        <div className="p-8 border-b border-slate-700">

          <h1 className="text-3xl font-extrabold text-blue-400">
            🚀 Trello Lite
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Project Management System
          </p>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-5 py-6">

          {menu.map((item) => (

            <Link
  key={item.path}
  to={item.path}
  className={`flex items-center gap-4 px-5 py-3 rounded-xl mb-3 transition-all duration-300 ${
    location.pathname === item.path
      ? "bg-blue-600 text-white shadow-lg"
      : "hover:bg-slate-800 text-slate-300"
  }`}
>

  <span className="text-lg">
    {item.icon}
  </span>

  <div className="flex items-center justify-between w-full">

    <span className="font-medium">

      {item.name}

    </span>

    {item.name === "Notifications" &&
      unreadCount > 0 && (

      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">

        {unreadCount}

      </span>

    )}

  </div>

</Link>

          ))}

        </nav>

        {/* Theme Toggle */}

        <div className="px-5 pb-4">

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 transition-all duration-300 rounded-xl py-3 font-semibold text-slate-200"
          >

            {darkMode ? <FaSun /> : <FaMoon />}

            {darkMode ? "Light Mode" : "Dark Mode"}

          </button>

        </div>

                {/* User Section */}

        <div className="border-t border-slate-700 p-6">

          <div className="flex items-center gap-4 mb-6">

            {user?.avatar ? (

              <img
                src={`http://localhost:5000/${user.avatar}`}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
              />

            ) : (

              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">

                <FaUserCircle className="text-3xl" />

              </div>

            )}

            <div>

              <h3 className="font-bold">

                {user?.name || "User"}

              </h3>

              <p className="text-sm text-slate-400">

                {user?.email || "No Email"}

              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-xl py-3 font-semibold"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>

      {/* Main Content */}

      <main className="flex-1 p-8 overflow-auto">

        <Outlet />

      </main>

    </div>
  );
}


export default Layout;