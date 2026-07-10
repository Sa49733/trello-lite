import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import Members from "../pages/members/Members";
import Activity from "../pages/activity/Activity";
import Tasks from "../pages/tasks/Tasks";
import SubmitTask from "../pages/tasks/SubmitTask";
import Kanban from "../pages/kanban/Kanban";
import Profile from "../pages/profile/Profile";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Notifications from "../pages/notifications/Notifications";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/:id/members"
            element={<Members />}
          />

          <Route
            path="/activity/:projectId"
            element={<Activity />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/tasks/submit/:id"
            element={<SubmitTask />}
          />
          <Route
         path="/notifications"
         element={<Notifications />}
         ></Route>


          <Route
            path="/kanban"
            element={<Kanban />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>
        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;