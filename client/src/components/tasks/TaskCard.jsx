import {
  FaTasks,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaTrash,
  FaPaperclip,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import AttachmentList from "./AttachmentList";

function TaskCard({
  task,
  editTask,
  deleteTask,
  updateStatus,
}) {

  const navigate = useNavigate();

  const loggedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const isOwner =
    task.createdBy?._id ===
    loggedUser?._id;

  return (
    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">

        <h2 className="text-2xl font-bold">
          {task.title}
        </h2>

        <p className="text-blue-100 mt-2">
          {task.description}
        </p>

      </div>

      {/* Body */}

      <div className="p-6">

        {/* Priority */}

        <div className="flex flex-wrap gap-3 mb-5">

          <span
            className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
              task.priority === "High"
                ? "bg-red-500"
                : task.priority === "Medium"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {task.priority === "High"
              ? "🔴 High"
              : task.priority ===
                "Medium"
              ? "🟡 Medium"
              : "🟢 Low"}
          </span>

          <span
            className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
              task.status === "Todo"
                ? "bg-yellow-500"
                : task.status ===
                  "In Progress"
                ? "bg-blue-500"
                : "bg-green-600"
            }`}
          >
            {task.status}
          </span>

        </div>

        {/* Project */}

        <div className="flex items-center gap-3 mb-4">

          <FaTasks className="text-indigo-600" />

          <span>

            <strong>Project:</strong>{" "}

            {task.project?.title || "N/A"}

          </span>

        </div>

                {/* Assigned Member */}

        <div className="flex items-center gap-4 mb-5">

          {task.assignedTo ? (

            <>

              {task.assignedTo.avatar ? (

                <img
                  src={`http://localhost:5000/${task.assignedTo.avatar}`}
                  alt={task.assignedTo.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />

              ) : (

                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">

                  {task.assignedTo.name
                    .charAt(0)
                    .toUpperCase()}

                </div>

              )}

              <div>

                <h3 className="font-bold text-lg">

                  {task.assignedTo.name}

                </h3>

                <p className="text-sm text-gray-500">

                  Assigned Member

                </p>

              </div>

            </>

          ) : (

            <>

              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">

                <FaUser className="text-gray-600" />

              </div>

              <div>

                <h3 className="font-bold">

                  Unassigned

                </h3>

                <p className="text-sm text-gray-500">

                  No member assigned

                </p>

              </div>

            </>

          )}

        </div>

        {/* Due Date */}

        <div className="flex items-center gap-3 mb-6">

          <FaCalendarAlt className="text-red-500" />

          <span>

            <strong>Due:</strong>{" "}

            {task.dueDate
              ? new Date(
                  task.dueDate
                ).toLocaleDateString()
              : "N/A"}

          </span>

        </div>

        {/* Attachments */}

        <div className="mb-6">

          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">

            <FaPaperclip />

            Attachments

          </h3>

          {task.attachments &&
          task.attachments.length > 0 ? (

            <AttachmentList
              attachments={task.attachments}
            />

          ) : (

            <div className="bg-slate-100 border border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-500">

              No attachments uploaded

            </div>

          )}

        </div>

        {/* Status Update */}

        <div className="mb-6">

          <label className="block font-semibold mb-2">

            Update Status

          </label>

          <select
            value={task.status}
            onChange={(e) =>
              updateStatus(
                task,
                e.target.value
              )
            }
            className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >

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

               {/* Action Buttons */}

        {isOwner ? (

          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() => editTask(task)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >

              <FaEdit />

              Edit

            </button>

            <button
              type="button"
              onClick={() =>
                deleteTask(task._id)
              }
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >

              <FaTrash />

              Delete

            </button>

          </div>

        ) : (

          <button
            type="button"
            onClick={() =>
              navigate(`/tasks/submit/${task._id}`)
            }
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
          >

            📤

            Submit Work

          </button>

        )}

      </div>

    </div>

  );

}

export default TaskCard;
