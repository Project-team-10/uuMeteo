import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MeContext } from "../contexts/MeContext";

export default function Login() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(MeContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900 bg-opacity-25">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form
            action={`${import.meta.env.VITE_BE_URL}/login/password`}
            method="post"
            className="space-y-2"
          >
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              autoComplete="username"
              autoFocus
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
