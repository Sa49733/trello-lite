import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import {
  FaClipboardList,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

import api from "../../services/api";

function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch tasks!");
    } finally {
      setLoading(false);
    }
  };

  // Drag & Drop
  const onDragEnd = async (result) => {
    const {
      destination,
      source,
      draggableId,
    } = result;

    if (!destination) return;

    if (
      destination.droppableId ===
      source.droppableId
    )
      return;

    try {
      const task = tasks.find(
        (t) => t._id === draggableId
      );

      if (!task) return;

      await api.put(`/tasks/${draggableId}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        project:
          typeof task.project === "object"
            ? task.project._id
            : task.project,
        status: destination.droppableId,
      });

      toast.success("Task moved successfully!");

      fetchTasks();
    } catch (error) {
      console.log(error);
      toast.error("Failed to move task!");
    }
  };

  // Task Columns
  const todo = tasks.filter(
    (task) => task.status === "Todo"
  );

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const done = tasks.filter(
    (task) => task.status === "Done"
  );

  // Render Column
  const renderColumn = (
    title,
    color,
    list,
    droppableId
  ) => (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${color} rounded-3xl shadow-xl p-6 min-h-[650px]`}
        >
          {/* Column Header */}

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {title}
            </h2>

            <span className="bg-white dark:bg-slate-800 dark:text-white rounded-full px-4 py-2 shadow font-bold">

              {list.length}

            </span>

          </div>

          {list.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-gray-500 dark:text-slate-400">

              <div className="text-5xl mb-3">
                📭
              </div>

              <h3 className="font-semibold text-slate-800 dark:text-white">
                No Tasks
              </h3>

              <p className="text-sm">
                Drag tasks here.
              </p>

            </div>
          )}

          {list.map((task, index) => (
            <Draggable
              key={task._id}
              draggableId={task._id}
              index={index}
            >
              {(provided) => (
                                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 mb-5 cursor-grab active:cursor-grabbing"
                >
                  {/* Title */}

                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
                    {task.title}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-300 mb-5">
                    {task.description}
                  </p>

                  {/* Priority */}

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-4 ${
                      task.priority === "High"
                        ? "bg-red-500"
                        : task.priority === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task.priority === "High"
                      ? "🔴 High"
                      : task.priority === "Medium"
                      ? "🟡 Medium"
                      : "🟢 Low"}
                  </span>

                  {/* Project */}

                  <div className="flex items-center gap-2 mb-2">

                    <FaClipboardList className="text-indigo-500" />

                    <span className="text-sm text-slate-700 dark:text-slate-300">

                      <strong className="text-slate-800 dark:text-white">Project:</strong>{" "}

                      {task.project?.title || "N/A"}

                    </span>

                  </div>

                  {/* Assigned */}

                  <div className="flex items-center gap-2 mb-2">

                    <FaUser className="text-blue-500" />

                    <span className="text-sm text-slate-700 dark:text-slate-300">

                      <strong className="text-slate-800 dark:text-white">Assigned:</strong>{" "}

                      {task.assignedTo
                        ? task.assignedTo.name
                        : "Unassigned"}

                    </span>

                  </div>

                  {/* Due Date */}

                  <div className="flex items-center gap-2">

                    <FaCalendarAlt className="text-red-500" />

                    <span className="text-sm text-slate-700 dark:text-slate-300">

                      <strong className="text-slate-800 dark:text-white">Due:</strong>{" "}

                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "N/A"}

                    </span>

                  </div>

                </div>
              )}
            </Draggable>
          ))}

          {provided.placeholder}

        </div>
      )}
    </Droppable>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">

        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">

          Loading Kanban...

        </h2>

      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>

      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-8">

        {/* Hero */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-3xl shadow-xl p-8 mb-10 text-white">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

            <div>

              <h1 className="text-4xl font-extrabold flex items-center gap-3">

                <FaClipboardList />

                Kanban Board

              </h1>

              <p className="mt-3 text-blue-100 text-lg">

                Drag and drop tasks between columns.

              </p>

            </div>

            <div className="bg-white/20 backdrop-blur rounded-2xl px-8 py-5 text-center">

              <p className="uppercase text-sm tracking-widest">

                Total Tasks

              </p>

              <h2 className="text-5xl font-bold">

                {tasks.length}

              </h2>

            </div>

          </div>

        </div>

        {/* Columns */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {renderColumn(
            "🟡 Todo",
            "bg-yellow-100 dark:bg-yellow-900/20",
            todo,
            "Todo"
          )}

          {renderColumn(
            "🔵 In Progress",
            "bg-blue-100 dark:bg-blue-900/20",
            inProgress,
            "In Progress"
          )}

          {renderColumn(
            "🟢 Done",
            "bg-green-100 dark:bg-green-900/20",
            done,
            "Done"
          )}

        </div>

      </div>

    </DragDropContext>
  );
}

export default Kanban;