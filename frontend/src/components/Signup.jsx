import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useForm } from "react-hook-form";
import { login } from "./Login.jsx";
import { upload } from "../firebase.js";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the eye icons

function Signup({ user }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      bio: "",
    },
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const handleRegister = async (data) => {
    setError("");
    try {
      if (data.profilePicture && data.profilePicture.length > 0) {
        const file = data.profilePicture[0];
        const url = await upload(file);
        data.profilePicture = url;
      } else {
        data.profilePicture = user?.profilePicture || "";
      }

      let res;
      if (user) {
        res = await axios.put(`http://localhost:5000/user/profile`, data, {
          withCredentials: true,
        });
        if (res?.status === 200) {
          alert("Profile Updated Successfully");
        }
      } else {
        res = await axios.post(`http://localhost:5000/user/register`, data);
        if (res?.status === 201) {
          alert("Successfully Registered");
          login(data, navigate, setError);
        }
      }

      if (res.status === 201) {
        navigate(`/profile/${user?.username}`);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      if (error?.response?.data?.message === "User already exists")
        setError(error?.response?.data?.message);
      else setError("An error occurred");
      console.log(error);
    }
    reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-100 rounded-xl p-6 border border-gray-300 shadow-md">
        {!user && (
          <div>
            <h2 className="text-center text-xl sm:text-2xl font-bold leading-tight mb-4">
              Sign up to create an account
            </h2>
            <p className="text-center text-sm sm:text-base text-black/60 mb-4">
              Already have an account?&nbsp;
              <Link
                to="/login"
                className="font-medium text-blue-600 transition-all duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        )}
        {user && (
          <div>
            <h2 className="text-center text-xl sm:text-2xl font-bold leading-tight mb-4">
              Edit Your Profile
            </h2>
          </div>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <div className="space-y-4">
            <Input
              label="Username: "
              placeholder="Username"
              {...register("username", {
                required: true,
              })}
              className="w-full"
            />
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
              className="w-full"
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
              className="w-full"
            />
            {!user && (
              <div>
                <div className="relative">
                  <Input
                    label="Password: "
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      validate: {
                        minLength: (value) =>
                          value.length >= 8 ||
                          "Password must be at least 8 characters long",
                        hasUpperCase: (value) =>
                          /[A-Z]/.test(value) ||
                          "Password must contain at least one uppercase letter",
                        hasSpecialChar: (value) =>
                          /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                          "Password must contain at least one special character",
                        hasDigit: (value) =>
                          /\d/.test(value) ||
                          "Password must contain at least one digit",
                      },
                    })}
                    className="w-full"
                  />
                  <span
                    className="absolute bottom-3 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-center mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
            <Input
              label="Bio: "
              type="text"
              placeholder="Enter your Bio"
              {...register("bio", {
                required: false,
              })}
              className="w-full"
            />
            {user && user.profilePicture && (
              <div className="text-center">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="mb-2 rounded-full h-24 w-24 mx-auto"
                />
                <p className="text-gray-500">Current Profile Picture</p>
              </div>
            )}
            <Input
              label="Profile Picture"
              type="file"
              {...register("profilePicture", {
                required: false,
              })}
              className="w-full"
            />
            <Button type="submit" className="w-full mt-4">
              {user ? "Save Changes" : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
