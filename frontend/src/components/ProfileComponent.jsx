import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Button from './Button'; // Import your custom Button component
const [isOwnProfile, setIsOwnProfile] = useState(false);


const ProfileComponent = ({ user, isOwnProfile, posts, totalHiddenPosts, handleDeleteAccount }) => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-300">
      <div className="flex flex-col justify-between items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Profile Picture or User Icon */}
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

          {/* Total Number of Posts and Hidden (Private) Posts */}
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
    </div>
  );
};

export default ProfileComponent;
