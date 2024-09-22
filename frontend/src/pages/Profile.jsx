import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components"; // Import Error component
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import Cookie from "cookies-js";
import Error from "../pages/ErrorPage";
import Swal from "sweetalert2"; // Import SweetAlert
import withReactContent from "sweetalert2-react-content"; // React support for SweetAlert

const MySwal = withReactContent(Swal); // Initialize SweetAlert2 with React

function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [posts, setPost] = useState([]);
  const [user, setUser] = useState({});
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState(null); // Error state
  const token = Cookie.get("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}user/profile/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setPost(response.data.user.posts);
        setIsOwnProfile(response.data.isOwnProfile);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load user data. Please try again later."); // Set error message
      }
    };
    fetchUserData();
  }, [username, token]);

  // Calculate the total number of hidden (Private) posts
  const totalHiddenPosts = posts.filter(
    (post) => post.isPublished === "Private"
  ).length;

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_URL}user/delete`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        Cookie.expire('token');
        MySwal.fire(
          "Deleted!",
          "Your account has been deleted successfully.",
          "success"
        ).then(() => {
          navigate("/login");
        });
      } catch (error) {
        console.error("Failed to delete account:", error);
        MySwal.fire({
          icon: "error",
          title: "Deletion Failed!",
          text: "An error occurred while deleting your account. Please try again later.",
        });
      }
    }
  };

  // Display error if any
  if (error) {
    return (
      <Container>
        <div className="py-8">
          <Error message={error} />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-full py-8 min-h-screen">
        <div className="max-w-md mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-300">
          <div className="flex flex-col justify-between items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-900"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 sm:w-32 sm:h-32 text-blue-950" />
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                {user.username}
              </h2>
              <p className="text-gray-900 text-lg mt-2">{user.name}</p>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mt-4">
                <div className="mt-2 text-center">
                  <strong className="text-blue-950 text-2xl">{posts.length}</strong>
                  <p className="text-gray-900 text-lg">Posts</p>
                </div>
                <div className="mt-2 text-center">
                  <strong className="text-blue-950 text-2xl">{totalHiddenPosts}</strong>
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
            <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
              <Button
                className="bg-gradient-to-r from-blue-900 to-blue-950 hover:from-indigo-950 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out"
                onClick={() => navigate("/user/edit-profile")}
              >
                Edit Profile
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          )}
        </div>

        {isOwnProfile && (
          <div className="text-center mt-6">
            <Button
              className="bg-gradient-to-r from-blue-900 to-blue-950 hover:from-indigo-950 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out"
              onClick={() => navigate("/user/favourites")}
            >
              Your Favourites
            </Button>
          </div>
        )}

        <hr className="border-black mt-10" />
        <div>
          <h1 className="mt-5 text-center text-3xl sm:text-4xl font-extrabold ">
            All Posts
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {posts
              .filter((post) => isOwnProfile || post.isPublished === "Public")
              .map((post) => (
                <div key={post._id} className="p-4">
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
