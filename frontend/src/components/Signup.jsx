import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useForm } from "react-hook-form";
import { login } from "./Login.jsx";
import { upload } from "../firebase.js";
import axios from "axios";

function Signup({ user }) {
  const { register, handleSubmit, reset, setValue, control, getValues } =
    useForm({
      defaultValues: {
        username: "",
        name: "",
        email: "",
        bio: "",
      },
    });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  // console.log(user)

  // Use useEffect to reset the form when the user prop changes
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
      // Check if a new profile picture is being uploaded
      if (data.profilePicture && data.profilePicture.length > 0) {
        const file = data.profilePicture[0];
        const url = await upload(file);
        data.profilePicture = url;
      } else {
        data.profilePicture = user?.profilePicture || ""; // Retain existing profile picture if not uploading a new one
      }
  
      let res;
      if (user) {
        // If user is editing their profile
        res = await axios.put(`http://localhost:5000/user/profile`, data, {
          withCredentials: true,
        });
          if (res?.status === 200) {
          alert("Profile Updated Successfully");
        }
      } else {
        // If user is registering a new account
        res = await axios.post(`http://localhost:5000/user/register`, data);
        if (res?.status === 201) {
          alert("Successfully Registered");
          login(data, navigate, setError);
        }
      }
  
      if (res.status == 201) {
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
  

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        {!user && (
          <div>
            <h2 className="text-center text-2xl font-bold leading-tight">
              Sign up to create account
            </h2>
            <p className="mt-2 text-center text-base text-black/60">
              Already have an account?&nbsp;
              <Link
                to="/login"
                className="font-medium text-primary transition-all duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        )}
        {user && (
          <div>
            <h2 className="text-center text-2xl font-bold leading-tight">
              Edit Your Profile
            </h2>
          </div>
        )}
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(handleRegister)}>
          <div className="space-y-5">
            <Input
              label="Username: "
              placeholder="Username"
              {...register("username", {
                required: true,
              })}
            />
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            {
              !user && (

            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
              )}
            <Input
              label="Bio: "
              type="text"
              placeholder="Enter your Bio"
              {...register("bio", {
                required: false,
              })}
            />
            {user && user.profilePicture && (
              <div>
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="mb-2 rounded-full h-24 w-24 mx-auto"
                />
                <p className="text-center text-gray-500">Current Profile Picture</p>
              </div>
            )}
            <Input
              label="Profile Picture"
              type="file"
              {...register("profilePicture", {
                required: false, // Not required when editing
              })}
            />
            <Button type="submit" className="w-full">
              {user ? "Save Changes" : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
