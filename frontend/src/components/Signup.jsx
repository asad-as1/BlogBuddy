import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Button, Input} from './index.js'
import {useForm} from 'react-hook-form'
import {login} from "./Login.jsx"
import axios from "axios"

function Signup() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleRegister = async (data) => {
      setError("");
      try {
        const res = await axios.post(`http://localhost:5000/user/register`, data);
        // console.log(res)
        if (res?.status === 201) {
          alert("Successfully Registered");
          login(data, navigate, setError);
          navigate("/");
        }
        else alert("something went wrong");
      } catch (error) {
        if(error?.response?.data?.message == "User already exists")
            setError(error?.response?.data?.message);
        else setError('Username is already taken')
        // console.log(error);
      }
      reset();
    };

  return (
    <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className='space-y-5'>
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
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        />
                        <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: true,})}
                        />
                        <Input
                        label='Profile Picture'
                        type='file'
                        {...register("profilePicture", {
                            required: false,  // todo
                        })}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default Signup