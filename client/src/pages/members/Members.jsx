import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaEnvelope,
  FaPlus,
  FaUserCircle,
} from "react-icons/fa";
import api from "../../services/api";

function Members() {
  const { id } = useParams();

  const [project, setProject] =
    useState(null);

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  // ===========================
  // Fetch Members
  // ===========================

  const fetchMembers = async () => {
    try {
      const { data } =
        await api.get(
          `/projects/${id}/members`
        );

      setProject(data);
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to fetch members!"
      );
    }
  };

  // ===========================
  // Add Member
  // ===========================

  const addMember = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        `/projects/${id}/members`,
        {
          email,
        }
      );

      toast.success(
        "Member Added Successfully!"
      );

      setEmail("");

      fetchMembers();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to add member!"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Remove Member
  // ===========================

  const removeMember = async (
    memberId
  ) => {
    try {
      await api.delete(
        `/projects/${id}/members/${memberId}`
      );

      toast.success(
        "Member Removed Successfully!"
      );

      fetchMembers();
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to remove member!"
      );
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">

        <h2 className="text-3xl font-bold">

          Loading Members...

        </h2>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Hero */}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 mb-10 text-white">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

          <div>

            <h1 className="text-4xl font-extrabold flex items-center gap-3">

              <FaUsers />

              Project Members

            </h1>

            <p className="text-blue-100 mt-3 text-lg">

              Invite teammates and manage project collaboration.

            </p>

          </div>

          <div className="bg-white/20 backdrop-blur rounded-2xl px-8 py-5 text-center">

            <p className="uppercase text-sm tracking-widest">

              Total Members

            </p>

            <h2 className="text-5xl font-bold">

              {project.members.length + 1}

            </h2>

          </div>

        </div>

      </div>

      {/* Invite Card */}

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

        <h2 className="text-2xl font-bold mb-6">

          Invite New Member

        </h2>

        <form
          onSubmit={addMember}
          className="space-y-5"
        >

          <div className="relative">

            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />

            <input
              type="email"
              placeholder="Enter member email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition shadow-lg"
          >

            <FaPlus />

            {loading
              ? "Adding..."
              : "Invite Member"}

          </button>

        </form>

      </div>
            {/* Project Owner */}

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

        <h2 className="text-2xl font-bold mb-6">

          Project Owner

        </h2>

        <div className="flex items-center justify-between flex-wrap gap-6">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">

              {project.createdBy.avatar ? (

                <img
                  src={`http://localhost:5000/${project.createdBy.avatar}`}
                  alt="Owner"
                  className="w-full h-full rounded-full object-cover"
                />

              ) : (

                project.createdBy.name
                  .charAt(0)
                  .toUpperCase()

              )}

            </div>

            <div>

              <h3 className="text-2xl font-bold">

                {project.createdBy.name}

              </h3>

              <p className="text-gray-600 mt-1">

                {project.createdBy.email}

              </p>

              <span className="inline-block mt-3 bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-semibold">

                👑 Owner

              </span>

            </div>

          </div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

            🟢 Active

          </span>

        </div>

      </div>

      {/* Members */}

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">

            Team Members

          </h2>

          <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold">

            {project.members.length}

          </span>

        </div>

        {project.members.length === 0 ? (

          <div className="text-center py-20">

            <FaUsers className="text-7xl text-gray-300 mx-auto mb-5" />

            <h3 className="text-2xl font-bold">

              No Members Yet

            </h3>

            <p className="text-gray-500 mt-3">

              Invite your teammates to start collaborating.

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {project.members.map((member) => (

              <div
                key={member.user._id}
                className="bg-slate-50 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row justify-between items-center gap-6"
              >

                <div className="flex items-center gap-5">

                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">

                    {member.user.avatar ? (

                      <img
                        src={`http://localhost:5000/${member.user.avatar}`}
                        alt="Member"
                        className="w-full h-full rounded-full object-cover"
                      />

                    ) : (

                      member.user.name
                        .charAt(0)
                        .toUpperCase()

                    )}

                  </div>

                  <div>

                    <h3 className="text-xl font-bold">

                      {member.user.name}

                    </h3>

                    <p className="text-gray-600">

                      {member.user.email}

                    </p>

                    <div className="flex gap-3 mt-3">

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">

                        👨‍💻 {member.role}

                      </span>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                        🟢 Active

                      </span>

                    </div>

                  </div>

                </div>
                                <button
                  onClick={() =>
                    removeMember(
                      member.user._id
                    )
                  }
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-300 shadow-lg"
                >
                  🗑 Remove
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Members;