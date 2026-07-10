import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Activity() {
  const { projectId } = useParams();

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get(
        `/activity/${projectId}`
      );

      setActivities(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Activity Timeline
      </h1>

      {activities.length === 0 ? (
        <p>No Activities Found.</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity._id}
            className="bg-white shadow rounded-xl p-5 mb-4"
          >
            <p className="font-semibold">
              {activity.action}
            </p>

            <p className="text-gray-600 mt-2">
              By {activity.user.name}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(
                activity.createdAt
              ).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Activity;