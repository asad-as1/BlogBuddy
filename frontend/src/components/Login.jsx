import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookie from "cookies-js";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookie.get("token");
    if (token) {
      // Redirect to the home page if a token is present
      navigate("/");
    }
  }, [navigate]);

  const login = async (data) => {
    setError("");
    try {
      const res = await axios.post(`http://localhost:5000/user/login`, data);
      if (res?.status === 200) {
        // alert("Successfully Logged In");
        const val = {
          "httpOnly": true,
          "secure": true
        };
        Cookie.set("token", res.data.token, val);
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-20 mb-20">
      <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Username: "
              placeholder="Enter your username"
              {...register("username", {
                required: true,
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
