import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCamera,
} from "react-icons/fa";
import api from "../../services/api";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [
    passwordLoading,
    setPasswordLoading,
  ] = useState(false);

  const [
    avatarLoading,
    setAvatarLoading,
  ] = useState(false);

  const [avatar, setAvatar] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  useEffect(() => {
    fetchProfile();
  }, []);

  // ===========================
  // Fetch Profile
  // ===========================

  const fetchProfile = async () => {
    try {
      const { data } =
        await api.get("/users/profile");

      setUser({
        name: data.name,
        email: data.email,
        avatar: data.avatar || "",
      });
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load profile!"
      );
    }
  };
    // ===========================
  // Handle Name Change
  // ===========================

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]:
        e.target.value,
    });
  };

  // ===========================
  // Handle Password Change
  // ===========================

  const handlePasswordChange = (
    e
  ) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ===========================
  // Handle Avatar Change
  // ===========================

  const handleAvatarChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setAvatar(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ===========================
  // Update Profile
  // ===========================

  const updateProfile = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(
        "/users/profile",
        {
          name: user.name,
        }
      );

      toast.success(
        "Profile Updated Successfully!"
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to update profile!"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Upload Avatar
  // ===========================

  const uploadAvatar = async () => {
    if (!avatar) {
      toast.error(
        "Please select an image!"
      );
      return;
    }

    try {
      setAvatarLoading(true);

      const formData =
        new FormData();

      formData.append(
        "avatar",
        avatar
      );

      const { data } =
        await api.post(
          "/users/avatar",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      toast.success(
        "Profile Picture Updated!"
      );

      setUser((prev) => ({
        ...prev,
        avatar: data.avatar,
      }));

      setAvatar(null);
      setPreview("");

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Upload Failed!"
      );
    } finally {
      setAvatarLoading(false);
    }
  };
    // ===========================
  // Change Password
  // ===========================

  const changePassword = async (
    e
  ) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error(
        "Please fill all fields!"
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      toast.error(
        "Passwords do not match!"
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put(
        "/users/change-password",
        {
          currentPassword:
            passwordData.currentPassword,
          newPassword:
            passwordData.newPassword,
        }
      );

      toast.success(
        "Password Changed Successfully!"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to change password!"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Hero */}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 mb-10 text-white">

        <h1 className="text-4xl font-extrabold">

          👤 User Profile

        </h1>

        <p className="text-blue-100 mt-3 text-lg">

          Manage your profile information and account security.

        </p>

      </div>

      {/* Profile Card */}

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Banner */}

        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">

          {/* Avatar */}

          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">

            <div className="relative">

              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-2xl">

                {preview ? (

                  <img
                    src={preview}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />

                ) : user.avatar ? (

                  <img
                  src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${user.avatar}`}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">

                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>

                )}

              </div>

              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 cursor-pointer shadow-lg">

                <FaCamera />

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleAvatarChange
                  }
                  className="hidden"
                />

              </label>

            </div>

          </div>

        </div>

        <div className="pt-24 px-10 pb-10">

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold">

              {user.name}

            </h2>

            <p className="text-gray-500">

              Full Stack Developer

            </p>

          </div>

          <button
            type="button"
            onClick={uploadAvatar}
            disabled={avatarLoading}
            className="w-full mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-lg"
          >

            {avatarLoading
              ? "Uploading..."
              : "Upload Profile Picture"}

          </button>
                    <form
            onSubmit={updateProfile}
            className="space-y-6"
          >

            {/* Name */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-2">

                <FaUser className="text-blue-600" />

                Name

              </label>

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Email */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-2">

                <FaEnvelope className="text-blue-600" />

                Email

              </label>

              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full rounded-xl border border-gray-300 bg-gray-100 p-4"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition duration-300 shadow-lg"
            >

              <FaSave />

              {loading
                ? "Updating..."
                : "Update Profile"}

            </button>

          </form>

          {/* Change Password */}

          <div className="mt-12 border-t pt-10">

            <div className="flex items-center gap-3 mb-8">

              <div className="bg-green-100 p-4 rounded-2xl">

                <FaLock className="text-2xl text-green-600" />

              </div>

              <div>

                <h2 className="text-3xl font-bold">

                  Change Password

                </h2>

                <p className="text-gray-500">

                  Keep your account secure by updating your password.

                </p>

              </div>

            </div>

            <form
              onSubmit={changePassword}
              className="space-y-6"
            >

              {/* Current Password */}

              <div>

                <label className="font-semibold mb-2">

                  Current Password

                </label>

                <div className="relative">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="w-full rounded-xl border border-gray-300 p-4 pr-14 outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                  >

                    {showCurrentPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}

                  </button>

                </div>

              </div>

              {/* New Password */}

              <div>

                <label className="font-semibold mb-2">

                  New Password

                </label>

                <div className="relative">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="w-full rounded-xl border border-gray-300 p-4 pr-14 outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                  >

                    {showNewPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}

                  </button>

                </div>

              </div>

              {/* Confirm Password */}

              <div>

                <label className="font-semibold mb-2">

                  Confirm Password

                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="w-full rounded-xl border border-gray-300 p-4 pr-14 outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                  >

                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}

                  </button>

                </div>

              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition shadow-lg"
              >

                <FaLock />

                {passwordLoading
                  ? "Changing Password..."
                  : "Change Password"}

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;