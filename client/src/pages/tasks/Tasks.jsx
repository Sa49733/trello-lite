import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

import AttachmentUpload from "../../components/tasks/AttachmentUpload";
import TaskCard from "../../components/tasks/TaskCard";

import {
  FaTasks,
  FaPlus,
  FaSearch,
  FaMoon,
  FaSun,
} from "react-icons/fa";

function Tasks() {

  // ==========================
  // State
  // ==========================

  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [attachments, setAttachments] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  // ==========================
  // Dark Theme
  // ==========================

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "theme",
        darkMode ? "dark" : "light"
      );
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // ==========================
  // Search
  // ==========================

  const [keyword, setKeyword] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("");

  const [sort, setSort] =
    useState("-createdAt");

  // ==========================
  // Form
  // ==========================

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      project: "",
      assignedTo: "",
    });

  // ==========================
  // Load Data
  // ==========================

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [
    keyword,
    statusFilter,
    priorityFilter,
    sort,
  ]);

  // ==========================
  // Fetch Projects
  // ==========================

  const fetchProjects = async () => {

    try {

      const { data } =
        await api.get("/projects");

      setProjects(data);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to fetch projects!"
      );

    }

  };

  // ==========================
  // Fetch Members
  // ==========================

  const fetchMembers = async (
    projectId
  ) => {

    try {

      const { data } =
        await api.get(
          `/projects/${projectId}/members`
        );

      const allMembers = [
        data.createdBy,
        ...data.members.map(
          (member) => member.user
        ),
      ];

      setMembers(allMembers);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to fetch members!"
      );

    }

  };
    // ==========================
  // Fetch Tasks
  // ==========================

  const fetchTasks = async () => {

    try {

      const { data } =
        await api.get("/tasks", {
          params: {
            keyword,
            status: statusFilter,
            priority: priorityFilter,
            sort,
          },
        });

      setTasks(data.tasks || []);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to fetch tasks!"
      );

    }

  };

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      name === "project" &&
      value
    ) {
      fetchMembers(value);
    }

  };

  // ==========================
  // Create / Update Task
  // ==========================

  const saveTask = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "priority",
        formData.priority
      );

      data.append(
        "dueDate",
        formData.dueDate
      );

      data.append(
        "project",
        formData.project
      );
      data.append(
  "assignedTo",
  formData.assignedTo
);

      attachments.forEach((file) => {

        data.append(
          "attachments",
          file
        );

      });

      // ==========================
      // Update Task
      // ==========================

      if (editId) {
                await api.put(
          `/tasks/${editId}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Task Updated Successfully!"
        );

      }

      // ==========================
      // Create Task
      // ==========================

      else {

        const response =
          await api.post(
            "/tasks",
            data,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        // ==========================
        // Assign Member
        // ==========================

        if (formData.assignedTo) {

          await api.put(
            `/tasks/assign/${response.data._id}`,
            {
              assignedTo:
                formData.assignedTo,
            }
          );

        }

        toast.success(
          "Task Created Successfully!"
        );

      }

      // ==========================
      // Reset Form
      // ==========================

      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        project: "",
        assignedTo: "",
      });

      setAttachments([]);

      setMembers([]);

      setEditId(null);

      fetchTasks();

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Something went wrong!"
      );

    }

  };

  // ==========================
  // Delete Task
  // ==========================

  
      const deleteTask = async (id) => {

    try {

      await api.delete(
        `/tasks/${id}`
      );

      toast.success(
        "Task Deleted Successfully!"
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

      toast.error(
        "Something went wrong!"
      );

    }

  };

  // ==========================
  // Edit Task
  // ==========================

  const editTask = (task) => {

    setEditId(task._id);

    const projectId =
      typeof task.project === "object"
        ? task.project._id
        : task.project;

    setFormData({

      title: task.title,

      description:
        task.description,

      priority:
        task.priority,

      dueDate: task.dueDate
        ? task.dueDate.substring(
            0,
            10
          )
        : "",

      project: projectId,

      assignedTo:
        task.assignedTo?._id || "",

    });

    if (projectId) {

      fetchMembers(
        projectId
      );

    }

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };

  // ==========================
  // Update Status
  // ==========================

  const updateStatus = async (
    task,
    status
  ) => {

    try {
            await api.put(
        `/tasks/${task._id}`,
        {
          title: task.title,

          description:
            task.description,

          priority:
            task.priority,

          dueDate:
            task.dueDate,

          project:
            typeof task.project ===
            "object"
              ? task.project._id
              : task.project,

          assignedTo:
            task.assignedTo?._id ||
            task.assignedTo ||
            "",

          status,
        }
      );

      toast.success(
        "Task Status Updated!"
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

      toast.error(
        "Something went wrong!"
      );

    }

  };

  // ==========================
  // Theme helper classnames
  // ==========================

  const cardClass = darkMode
    ? "bg-black border border-gray-800 text-gray-100"
    : "bg-white text-gray-900";

  const inputClass = darkMode
    ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
    : "border focus:ring-2 focus:ring-blue-500 outline-none";

  const labelClass = darkMode
    ? "text-gray-200"
    : "text-gray-800";

  const mutedTextClass = darkMode
    ? "text-gray-400"
    : "text-gray-500";

  const iconBoxClass = darkMode
    ? "bg-blue-500/10"
    : "bg-blue-100";

  // ==========================
  // UI
  // ==========================

  return (

    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode
          ? "bg-black"
          : "bg-slate-100"
      }`}
    >

      {/* Hero Section */}

      <div
        className={`rounded-3xl shadow-xl p-8 mb-10 text-white ${
          darkMode
            ? "bg-gradient-to-r from-gray-950 via-black to-gray-900 border border-gray-800"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
        }`}
      >

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

          <div>

            <h1 className="text-4xl font-extrabold flex items-center gap-3">

              <FaTasks />

              Task Manager

            </h1>

            <p className={`mt-3 text-lg ${darkMode ? "text-gray-400" : "text-blue-100"}`}>

              Organize, assign and track every task in one place.

            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-white/20 backdrop-blur rounded-2xl px-8 py-5 text-center">

              <p className="uppercase text-sm tracking-widest">

                Total Tasks

              </p>

              <h2 className="text-5xl font-bold">

                {tasks.length}

              </h2>

            </div>

            {/* Dark Mode Toggle */}

            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="bg-white/20 backdrop-blur rounded-2xl p-5 hover:bg-white/30 transition-colors"
            >

              {darkMode ? (
                <FaSun className="text-2xl text-yellow-300" />
              ) : (
                <FaMoon className="text-2xl text-white" />
              )}

            </button>

          </div>

        </div>

      </div>
            {/* Create Task */}

      <div className={`rounded-3xl shadow-xl p-8 mb-10 transition-colors duration-300 ${cardClass}`}>

        <div className="flex items-center gap-4 mb-8">

          <div className={`p-4 rounded-2xl ${iconBoxClass}`}>

            <FaPlus className="text-2xl text-blue-500" />

          </div>

          <div>

            <h2 className="text-3xl font-bold">

              {editId
                ? "Update Task"
                : "Create New Task"}

            </h2>

            <p className={mutedTextClass}>

              Fill in the details below to manage your project tasks.

            </p>

          </div>

        </div>

        <form
          onSubmit={saveTask}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* Title */}

          <div className="md:col-span-2">

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Task Title

            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={`w-full rounded-xl p-4 ${inputClass}`}
              required
            />

          </div>

          {/* Description */}

          <div className="md:col-span-2">

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Description

            </label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className={`w-full rounded-xl p-4 ${inputClass}`}
              required
            />

          </div>

          {/* Priority */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Priority

            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full rounded-xl p-4 ${inputClass}`}
            >

              <option value="Low">

                🟢 Low

              </option>

              <option value="Medium">

                🟡 Medium

              </option>

              <option value="High">

                🔴 High

              </option>

            </select>

          </div>

          {/* Due Date */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Due Date

            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full rounded-xl p-4 ${inputClass}`}
            />

          </div>
                    {/* Project */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Project

            </label>

            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className={`w-full rounded-xl p-4 ${inputClass}`}
              required
            >

              <option value="">

                Select Project

              </option>

              {projects.map((project) => (

                <option
                  key={project._id}
                  value={project._id}
                >

                  {project.title}

                </option>

              ))}

            </select>

          </div>

          {/* Assign Member */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Assign Member

            </label>

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className={`w-full rounded-xl p-4 ${inputClass}`}
            >

              <option value="">

                Unassigned

              </option>

              {members.map((member) => (

                <option
                  key={member._id}
                  value={member._id}
                >

                  {member.name}

                </option>

              ))}

            </select>

          </div>

          {/* Attachments */}

          <div className="md:col-span-2">

            <AttachmentUpload
              attachments={attachments}
              setAttachments={setAttachments}
              darkMode={darkMode}
            />

          </div>

          {/* Submit Button */}

          <div className="md:col-span-2">

            <button
              type="submit"
              className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
                editId
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : darkMode
                  ? "bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >

              {editId
                ? "Update Task"
                : "Create Task"}

            </button>

          </div>

        </form>

      </div>
            {/* Search & Filters */}

      <div className={`rounded-3xl shadow-xl p-8 mb-10 transition-colors duration-300 ${cardClass}`}>

        <div className="flex items-center gap-4 mb-8">

          <div className={`p-4 rounded-2xl ${iconBoxClass}`}>

            <FaSearch className="text-2xl text-blue-500" />

          </div>

          <div>

            <h2 className="text-3xl font-bold">

              Search & Filters

            </h2>

            <p className={mutedTextClass}>

              Search, filter and sort your tasks instantly.

            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Search */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Search

            </label>

            <input
              type="text"
              placeholder="Search tasks..."
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              className={`w-full rounded-xl p-4 ${inputClass}`}
            />

          </div>

          {/* Status */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Status

            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className={`w-full rounded-xl p-4 ${inputClass}`}
            >

              <option value="">

                All Status

              </option>

              <option value="Todo">

                🟡 Todo

              </option>

              <option value="In Progress">

                🔵 In Progress

              </option>

              <option value="Done">

                🟢 Done

              </option>

            </select>

          </div>

          {/* Priority */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Priority

            </label>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className={`w-full rounded-xl p-4 ${inputClass}`}
            >

              <option value="">

                All Priority

              </option>

              <option value="High">

                🔴 High

              </option>

              <option value="Medium">

                🟡 Medium

              </option>

              <option value="Low">

                🟢 Low

              </option>

            </select>

          </div>

          {/* Sort */}

          <div>

            <label className={`block font-semibold mb-2 ${labelClass}`}>

              Sort By

            </label>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className={`w-full rounded-xl p-4 ${inputClass}`}
            >

              <option value="-createdAt">

                Newest First

              </option>

              <option value="createdAt">

                Oldest First

              </option>

              <option value="priority">

                Priority

              </option>

              <option value="dueDate">

                Due Date

              </option>

            </select>

          </div>

        </div>

      </div>
            {/* Task List */}

      {tasks.length === 0 ? (

        <div className={`rounded-3xl shadow-xl p-12 text-center transition-colors duration-300 ${cardClass}`}>

          <div className="text-7xl mb-5">

            📋

          </div>

          <h2 className="text-3xl font-bold mb-3">

            No Tasks Found

          </h2>

          <p className={mutedTextClass}>

            Create your first task to get started.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {tasks.map((task) => (

            <TaskCard
              key={task._id}
              task={task}
              editTask={editTask}
              deleteTask={deleteTask}
              updateStatus={updateStatus}
              darkMode={darkMode}
            />

          ))}

        </div>

      )}
          </div>

  );

}

export default Tasks;