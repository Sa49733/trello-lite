import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Pie,
  Bar,
} from "react-chartjs-2";

import {
  FaFolderPlus,
  FaTasks,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();

  // ===========================
  // Logged In User
  // ===========================

  const [user, setUser] =
    useState(null);

  // ===========================
  // Dashboard Statistics
  // ===========================

  const [stats, setStats] =
    useState({
      totalProjects: 0,
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0,
    });

  // ===========================
  // Load Dashboard
  // ===========================

  useEffect(() => {
    fetchDashboard();

    const loggedUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    setUser(loggedUser);
  }, []);

  // ===========================
  // Fetch Dashboard
  // ===========================

  const fetchDashboard =
    async () => {
      try {
        const { data } =
          await api.get(
            "/dashboard"
          );

        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

  // ===========================
  // Pie Chart
  // ===========================

  const pieData = {
    labels: [
      "Todo",
      "In Progress",
      "Done",
    ],

    datasets: [
      {
        data: [
          stats.todoTasks,
          stats.inProgressTasks,
          stats.doneTasks,
        ],

        backgroundColor: [
          "#facc15",
          "#3b82f6",
          "#22c55e",
        ],

        borderWidth: 2,
      },
    ],
  };

  // ===========================
  // Bar Chart
  // ===========================

  const barData = {
    labels: [
      "Projects",
      "Tasks",
    ],

    datasets: [
      {
        label: "Overview",

        data: [
          stats.totalProjects,
          stats.totalTasks,
        ],

        backgroundColor: [
          "#3b82f6",
          "#14b8a6",
        ],

        borderRadius: 8,
      },
    ],
  };

  return (
        <div className="p-8">

      {/* Welcome Banner */}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-3xl shadow-xl p-8 text-white mb-10">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

          <div>

            <h1 className="text-4xl font-extrabold">

              👋 Welcome Back, {user?.name || "User"}

            </h1>

            <p className="mt-3 text-lg text-blue-100">

              Manage your projects efficiently and
              stay productive with Trello Lite.

            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={() =>
                navigate("/projects")
              }
              className="flex items-center gap-2 bg-white dark:bg-slate-200 text-blue-700 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 hover:bg-gray-100 transition-all"
            >

              <FaFolderPlus />

              New Project

            </button>

            <button
              onClick={() =>
                navigate("/tasks")
              }
              className="flex items-center gap-2 bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 hover:bg-yellow-300 transition-all"
            >

              <FaTasks />

              New Task

            </button>

          </div>

        </div>

      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <p className="text-blue-500 text-4xl mb-4">

            📁

          </p>

          <h3 className="text-gray-500 dark:text-slate-400 font-medium">

            Total Projects

          </h3>

          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">

            {stats.totalProjects}

          </p>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <p className="text-purple-500 text-4xl mb-4">

            📋

          </p>

          <h3 className="text-gray-500 dark:text-slate-400 font-medium">

            Total Tasks

          </h3>

          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">

            {stats.totalTasks}

          </p>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <p className="text-yellow-500 text-4xl mb-4">

            🟡

          </p>

          <h3 className="text-gray-500 dark:text-slate-400 font-medium">

            Todo

          </h3>

          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">

            {stats.todoTasks}

          </p>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <p className="text-blue-500 text-4xl mb-4">

            🔵

          </p>

          <h3 className="text-gray-500 dark:text-slate-400 font-medium">

            In Progress

          </h3>

          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">

            {stats.inProgressTasks}

          </p>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <p className="text-green-500 text-4xl mb-4">

            🟢

          </p>

          <h3 className="text-gray-500 dark:text-slate-400 font-medium">

            Completed

          </h3>

          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">

            {stats.doneTasks}

          </p>

        </div>

      </div>
            {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

        {/* Pie Chart */}

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">

              📊 Task Status

            </h2>

            <span className="text-sm text-gray-500 dark:text-slate-400">

              Live Overview

            </span>

          </div>

          <div className="max-w-sm mx-auto">

            <Pie data={pieData} />

          </div>

        </div>

        {/* Bar Chart */}

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">

              📈 Project Overview

            </h2>

            <span className="text-sm text-gray-500 dark:text-slate-400">

              Analytics

            </span>

          </div>

          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />

        </div>

      </div>

      {/* Workspace Summary */}

      <div className="mt-10 bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">

          📌 Workspace Summary

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-5">

            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">

              Projects

            </h3>

            <p className="text-gray-600 dark:text-slate-300">

              You currently have

              <span className="font-bold text-blue-600 dark:text-blue-400">

                {" "}

                {stats.totalProjects}

                {" "}

              </span>

              active project(s).

            </p>

          </div>

          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-5">

            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">

              Tasks

            </h3>

            <p className="text-gray-600 dark:text-slate-300">

              Total tasks created:

              <span className="font-bold text-purple-600 dark:text-purple-400">

                {" "}

                {stats.totalTasks}

              </span>

            </p>

          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-5">

            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">

              Todo

            </h3>

            <p className="text-yellow-700 dark:text-yellow-400 font-bold text-2xl">

              {stats.todoTasks}

            </p>

          </div>

          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-5">

            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">

              Completed

            </h3>

            <p className="text-green-700 dark:text-green-400 font-bold text-2xl">

              {stats.doneTasks}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;