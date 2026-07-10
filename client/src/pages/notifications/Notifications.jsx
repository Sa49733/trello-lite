import { useEffect, useState } from "react";
import api from "../../services/api";

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================
  // Fetch Notifications
  // ==========================

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications =
    async () => {

      try {

        const { data } =
          await api.get(
            "/notifications"
          );

        setNotifications(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // ==========================
  // Mark As Read
  // ==========================

  const markAsRead = async (id) => {

    try {

      await api.put(
        `/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

    } catch (error) {

      console.log(error);

    }

  };

  // ==========================
  // Mark All Read
  // ==========================

  const markAllRead =
    async () => {

      try {

        await api.put(
          "/notifications/read-all"
        );

        setNotifications((prev) =>
          prev.map(
            (notification) => ({
              ...notification,
              isRead: true,
            })
          )
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================
  // Delete Notification
  // ==========================

  const deleteNotification =
    async (id) => {

      try {

        await api.delete(
          `/notifications/${id}`
        );

        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              notification._id !== id
          )
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================
  // Delete All Notifications
  // ==========================

  const deleteAllNotifications =
    async () => {

      try {

        for (const notification of notifications) {

          await api.delete(
            `/notifications/${notification._id}`
          );

        }

        setNotifications([]);

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================
  // Unread Count
  // ==========================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

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

return (

  <div className="p-8">

    {/* Header */}

    <div className="flex justify-between items-center mb-8">

      <div>

        <h1 className="text-4xl font-bold">

          🔔 Notifications

        </h1>

        <p className="text-gray-500 mt-2">

          Unread Notifications :{" "}

          <span className="font-bold text-blue-600">

            {unreadCount}

          </span>

        </p>

      </div>

      {notifications.length > 0 && (

        <div className="flex gap-3">

          <button
            onClick={markAllRead}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg"
          >

            ✔ Mark All Read

          </button>

          <button
            onClick={deleteAllNotifications}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg"
          >

            🗑 Delete All

          </button>

        </div>

      )}

    </div>

    {notifications.length === 0 ? (

      <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

        <h2 className="text-2xl font-bold text-gray-600">

          No Notifications Yet

        </h2>

        <p className="text-gray-500 mt-3">

          You're all caught up 🎉

        </p>

      </div>

    ) : (

      <div className="space-y-5">

        {notifications.map(
          (notification) => (

            <div
              key={notification._id}
              className={`rounded-3xl shadow-xl p-6 border-l-8 transition-all ${
                notification.isRead
                  ? "bg-white border-gray-300"
                  : "bg-blue-50 border-blue-600"
              }`}
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-xl font-bold">

                    {notification.title}

                  </h2>

                  <p className="text-gray-600 mt-2">

                    {notification.message}

                  </p>

                  {notification.task && (

                    <p className="mt-2 font-semibold">

                      📋 Task :

                      {" "}

                      {notification.task.title}

                    </p>

                  )}

                  {notification.project && (

                    <p className="font-semibold">

                      📁 Project :

                      {" "}

                      {notification.project.title}

                    </p>

                  )}

                  <p className="text-sm text-gray-500 mt-3">

                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}

                  </p>

                </div>

                <div className="flex gap-3">

                  {!notification.isRead && (

                    <button
                      onClick={() =>
                        markAsRead(
                          notification._id
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    >

                      Mark Read

                    </button>

                  )}

                  <button
                    onClick={() =>
                      deleteNotification(
                        notification._id
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                  >

                    Delete

                  </button>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    )}

  </div>

);

}

export default Notifications;
