import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [posts, setPost] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setPost(res.data.user.posts);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <Container>
      <div className="w-full py-8 min-h-screen">
        <div className="max-w-md mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-300">
          <div className="flex items-center space-x-4">
            {/* Profile Picture or User Icon */}
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-blue-950" />
            )}
            <div className="">
              <h2 className="text-3xl font-extrabold text-blue-950">
                {user.username}
              </h2>
              <p className="text-gray-900 text-xl">{user.name}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-900 text-lg">
              <strong className="text-blue-950">Email:</strong> {user.email}
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button
            className="bg-gradient-to-r from-blue-900 to-blue-950 hover:from-indigo-950 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out"
            onClick={() => {
              navigate("/user/favourites");
            }}
          >
            Your Favourites
          </Button>
        </div>
        <hr className="border-black mt-10" />
        <div>
          <h1 className="mt-5 text-center text-4xl font-extrabold text-blue-950">
            Your All Posts
          </h1>
          <div className="flex flex-wrap justify-around mt-8">
            {posts.map((post) => (
              <div key={post._id} className="p-4 w-1/3">
                <PostCard {...post} />
                {post.isPublished === "Private" && (
                  <h2 className="text-center text-xl mt-2">
                    {`${post.isPublished}`} Post
                  </h2>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Profile;
