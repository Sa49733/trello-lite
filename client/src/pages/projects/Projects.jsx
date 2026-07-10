import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

import {
  FaFolderPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaHistory,
  FaMoon,
  FaSun,
} from "react-icons/fa";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch projects!");
    }
  };

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create / Update
  const saveProject = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(
          `/projects/${editId}`,
          formData
        );

        toast.success(
          "Project Updated Successfully!"
        );
      } else {
        await api.post(
          "/projects",
          formData
        );

        toast.success(
          "Project Created Successfully!"
        );
      }

      setFormData({
        title: "",
        description: "",
      });

      setEditId(null);

      fetchProjects();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // Edit
  const editProject = (project) => {
    setEditId(project._id);

    setFormData({
      title: project.title,
      description: project.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete
  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);

      toast.success(
        "Project Deleted Successfully!"
      );

      fetchProjects();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // ==========================
  // Theme helper classnames
  // ==========================

  const cardClass = darkMode
    ? "bg-black border border-gray-800 text-gray-100"
    : "bg-white text-gray-900";

  const inputClass = darkMode
    ? "bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
    : "border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none";

  const mutedTextClass = darkMode
    ? "text-gray-400"
    : "text-gray-500";

  const iconBoxClass = darkMode
    ? "bg-blue-500/10"
    : "bg-blue-100";

  const idBoxClass = darkMode
    ? "bg-gray-900 border border-gray-800"
    : "bg-slate-100";

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black" : "bg-slate-100"
      }`}
    >

  {/* Header */}
  <div
    className={`rounded-3xl shadow-xl p-8 text-white mb-10 ${
      darkMode
        ? "bg-gradient-to-r from-gray-950 via-black to-gray-900 border border-gray-800"
        : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
    }`}
  >

    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

      <div>

        <h1 className="text-4xl font-extrabold">
          📁 Projects
        </h1>

        <p className={`mt-3 text-lg ${darkMode ? "text-gray-400" : "text-blue-100"}`}>
          Organize and manage all your projects in one place.
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="bg-white/20 px-6 py-3 rounded-2xl backdrop-blur">

          <p className="text-sm uppercase tracking-wider">
            Total Projects
          </p>

          <h2 className="text-3xl font-bold">
            {projects.length}
          </h2>

        </div>

        {/* Dark Mode Toggle */}

        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="bg-white/20 backdrop-blur rounded-2xl p-4 hover:bg-white/30 transition-colors"
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

  {/* Project Form */}

  <div className={`rounded-3xl shadow-xl p-8 mb-10 transition-colors duration-300 ${cardClass}`}>

    <div className="flex items-center gap-3 mb-6">

      <div className={`p-3 rounded-xl ${iconBoxClass}`}>

        <FaFolderPlus className="text-2xl text-blue-500" />

      </div>

      <div>

        <h2 className="text-2xl font-bold">

          {editId
            ? "Update Project"
            : "Create New Project"}

        </h2>

        <p className={mutedTextClass}>

          Add and manage your project details.

        </p>

      </div>

    </div>

    <form
      onSubmit={saveProject}
      className="space-y-5"
    >

      <input
        type="text"
        name="title"
        placeholder="Project Title"
        value={formData.title}
        onChange={handleChange}
        className={`w-full rounded-xl p-4 ${inputClass}`}
        required
      />

      <textarea
        rows="5"
        name="description"
        placeholder="Project Description"
        value={formData.description}
        onChange={handleChange}
        className={`w-full rounded-xl p-4 ${inputClass}`}
        required
      />

      <button
        type="submit"
        className={`flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 ${
          editId
            ? "bg-green-600 hover:bg-green-700"
            : darkMode
            ? "bg-blue-700 hover:bg-blue-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <FaFolderPlus />

        {editId
          ? "Update Project"
          : "Create Project"}

      </button>

    </form>

  </div>

  {/* Project Cards */}
  {projects.length === 0 ? (
  <div className={`rounded-3xl shadow-xl p-12 text-center transition-colors duration-300 ${cardClass}`}>

    <h2 className="text-3xl mb-3">
      📁
    </h2>

    <h3 className="text-2xl font-bold mb-2">
      No Projects Found
    </h3>

    <p className={mutedTextClass}>
      Create your first project to get started.
    </p>

  </div>
) : (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

    {projects.map((project) => (
      <div
        key={project._id}
        className={`rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${cardClass}`}
      >

        {/* Card Header */}

        <div
          className={`p-6 text-white ${
            darkMode
              ? "bg-gradient-to-r from-gray-900 to-black border-b border-gray-800"
              : "bg-gradient-to-r from-blue-600 to-indigo-600"
          }`}
        >

          <h2 className="text-2xl font-bold">
            {project.title}
          </h2>

          <p className={`mt-2 line-clamp-2 ${darkMode ? "text-gray-400" : "text-blue-100"}`}>
            {project.description}
          </p>

        </div>

        {/* Card Body */}

        <div className="p-6">

          <div className="flex items-center justify-between mb-6">

            <div className={`rounded-xl px-4 py-2 ${idBoxClass}`}>

              <p className={`text-sm ${mutedTextClass}`}>
                Project ID
              </p>

              <p className="font-semibold">
                {project._id.slice(-6)}
              </p>

            </div>

            <div
              className={`px-4 py-2 rounded-xl font-semibold ${
                darkMode
                  ? "bg-green-500/10 text-green-400"
                  : "bg-green-100 text-green-700"
              }`}
            >

              Active

            </div>

          </div>

          {/* Buttons */}

          <div className="grid grid-cols-2 gap-4">

            <button
              onClick={() => editProject(project)}
              className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl transition"
            >
              <FaEdit />
              Edit
            </button>

            <button
              onClick={() =>
                deleteProject(project._id)
              }
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
            >
              <FaTrash />
              Delete
            </button>

            <button
              onClick={() =>
                navigate(
                  `/projects/${project._id}/members`
                )
              }
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition"
            >
              <FaUsers />
              Members
            </button>

            <button
              onClick={() =>
                navigate(
                  `/activity/${project._id}`
                )
              }
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition"
            >
              <FaHistory />
              Activity
            </button>

          </div>

        </div>

      </div>
    ))}

  </div>
)}

</div>
);
}

export default Projects;