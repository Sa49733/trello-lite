import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaKey } from "react-icons/fa";
import api from "../../services/api";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const { data } =
        await api.post(
          "/auth/forgot-password",
          {
            email,
          }
        );

      toast.success(
        data.message
      );

      setEmail("");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong!"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">

        <div className="flex justify-center mb-5">

          <div className="bg-white p-5 rounded-full shadow-lg">

            <FaKey className="text-4xl text-blue-600" />

          </div>

        </div>

        <h1 className="text-4xl font-extrabold text-center text-white">

          Forgot Password

        </h1>

        <p className="text-center text-blue-100 mt-2 mb-8">

          Enter your registered email.

        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="text-white font-medium">

              Email

            </label>

            <div className="relative mt-2">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-700 py-3 rounded-xl font-bold text-lg hover:bg-blue-100 transition-all duration-300 shadow-lg"
          >

            {loading
              ? "Sending..."
              : "Send Reset Link"}

          </button>

        </form>

        <p className="text-center text-white mt-8">

          <Link
            to="/"
            className="font-bold text-yellow-300 hover:text-yellow-200"
          >

            Back to Login

          </Link>

        </p>

      </div>

    </div>

  );

}

export default ForgotPassword;
