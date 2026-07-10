import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "../../services/api";
import toast from "react-hot-toast";

function SubmitTask() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [task, setTask] =
    useState(null);

  const [status, setStatus] =
    useState("Todo");

  const [attachments, setAttachments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================
  // Fetch Task
  // ==========================

  useEffect(() => {

    fetchTask();

  }, []);

  const fetchTask = async () => {

    try {

      const { data } =
        await api.get("/tasks");

      const selectedTask =
        data.tasks.find(
          (task) =>
            task._id === id
        );

      if (!selectedTask) {

        toast.error("Task not found");
        navigate("/tasks");

        return;

      }

      setTask(selectedTask);

      setStatus(
        selectedTask.status
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to load task."
      );

      navigate("/tasks");

    } finally {

      setLoading(false);

    }

  };
    // ==========================
  // Submit Work
  // ==========================

  const submitWork = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append(
        "status",
        status
      );

      attachments.forEach((file) => {

        formData.append(
          "attachments",
          file
        );

      });

      await api.put(

        `/tasks/${id}`,

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

      toast.success("Work submitted successfully!");

      navigate("/tasks");

   } catch (error) {

  console.log(error);

  toast.error(
    "Failed to submit work."
  );

}

  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen text-2xl font-bold">

        Loading...

      </div>

    );

  }

  // ==========================
  // Guard: no task loaded
  // ==========================
  // This can happen briefly if the task wasn't found or the
  // fetch failed, since we navigate away right after. Without
  // this guard, the render below would crash trying to read
  // properties off a null `task`.

  if (!task) {

    return null;

  }

    return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-2">
          📤 Submit Task
        </h1>

        <p className="text-gray-500 mb-8">
          Upload your work and update the task status.
        </p>

        <form onSubmit={submitWork} className="space-y-6">

          {/* Task Title */}

          <div>

            <label className="block font-semibold mb-2">
              Task Title
            </label>

            <input
              type="text"
              value={task.title}
              readOnly
              className="w-full border rounded-xl p-4 bg-gray-100"
            />

          </div>

          {/* Description */}

          <div>

            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              value={task.description}
              readOnly
              rows={4}
              className="w-full border rounded-xl p-4 bg-gray-100 resize-none"
            />

          </div>

          {/* Project */}

          <div>

            <label className="block font-semibold mb-2">
              Project
            </label>

            <input
              type="text"
              value={task.project?.title || ""}
              readOnly
              className="w-full border rounded-xl p-4 bg-gray-100"
            />

          </div>

          {/* Assigned Member */}

          <div>

            <label className="block font-semibold mb-2">
              Assigned To
            </label>

            <input
              type="text"
              value={task.assignedTo?.name || ""}
              readOnly
              className="w-full border rounded-xl p-4 bg-gray-100"
            />

          </div>

          {/* Status */}

          <div>

            <label className="block font-semibold mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full border rounded-xl p-4"
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

          {/* Upload Files */}

          <div>

            <label className="block font-semibold mb-2">
              Upload Attachments
            </label>

            <input
              type="file"
              multiple
              onChange={(e) =>
                setAttachments(
                  Array.from(e.target.files)
                )
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          {/* Submit */}

          <div className="flex gap-4">

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              📤 Submit Work
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/tasks")
              }
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );

}

export default SubmitTask;