import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MeContext } from "../contexts/MeContext";

const BE_URL = import.meta.env.VITE_BE_URL;

export default function Login() {
  const navigate = useNavigate();
  const me = useContext(MeContext);

  useEffect(() => {
    if (me.isLoggedIn) {
      navigate("/");
    }
  }, [me.isLoggedIn]);

  return (
    <div className="w-screen h-screen items-center flex justify-center flex-col">
      <form
        action={BE_URL + "/login/password"}
        method="post"
        className="flex flex-col items-center gap-5 w-[24rem] h-[16rem] border-blue-400 border-2 rounded-lg"
      >
        <h1 className="p-2 text-xl font-bold">Login</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="username"
          autoFocus
          required
          className="bg-blue-200 text-center rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          className="bg-blue-200 text-center rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-3 py-1"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
