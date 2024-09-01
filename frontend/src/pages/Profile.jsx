import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import Cookie from "cookies-js"

function Profile() {
  const navigate = useNavigate();
  const { username } = useParams(); // Get the username from the URL
  const [posts, setPost] = useState([]);
  const [user, setUser] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/profile/${username}`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setPost(response.data.user.posts);
        setIsOwnProfile(response.data.isOwnProfile);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [username]);

  // Calculate the total number of hidden (Private) posts
  const totalHiddenPosts = posts.filter(
    (post) => post.isPublished === "Private"
  ).length;

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:5000/user/delete`, {
        withCredentials: true,
      });
      Cookie.expire('token'); 
      alert("Account Deleted Successfully!")
      navigate("/login"); // Redirect to home or login page after deletion
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

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
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-900"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-blue-950" />
            )}
            <div>
              <h2 className="text-3xl font-extrabold text-blue-950">
                {user.username}
              </h2>
              <p className="text-gray-900 text-xl mt-2">{user.name}</p>

              {/* Total Number of Posts and Hidden (Private) Posts */}
              <div className="flex justify-between gap-4">
                <div className="mt-2 text-center">
                  <strong className="text-blue-950 text-center">
                    {posts.length}
                  </strong>
                  <p className="text-gray-900 text-lg">Posts</p>
                </div>
                <div className="mt-2 text-center">
                  <strong className="text-blue-950 text-center">
                    {totalHiddenPosts}
                  </strong>
                  <p className="text-gray-900 text-lg">Private Posts</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {isOwnProfile && (
              <p className="text-gray-900 text-lg">
                <strong className="text-blue-950">Email:</strong> {user.email}
              </p>
            )}
            {user.bio && (
              <p className="text-gray-900 text-lg">
                <strong className="text-blue-950">Bio:</strong> {user.bio}
              </p>
            )}
          </div>
          {isOwnProfile && (
            <div className="mt-4 flex justify-between">
              <Button
                className="bg-gradient-to-r from-blue-900 to-blue-950 hover:from-indigo-950 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out"
                onClick={() => {
                  navigate("/user/edit-profile");
                }}
              >
                Edit Profile
              </Button>
              {isOwnProfile && (
                // <div>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                // </div>
              )}
            </div>
          )}
        </div>

        {isOwnProfile && (
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
        )}

        <hr className="border-black mt-10" />
        <div>
          <h1 className="mt-5 text-center text-4xl font-extrabold text-blue-950">
            All Posts
          </h1>
          <div className="flex flex-wrap justify-around mt-8">
            {posts
              .filter((post) => isOwnProfile || post.isPublished === "Public")
              .map((post) => (
                <div key={post._id} className="p-4 w-1/3">
                  <PostCard {...post} />
                  {isOwnProfile && (
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
