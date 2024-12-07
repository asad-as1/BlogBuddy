import React from 'react';
import { FaUserCircle, FaLink, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Users, Award, Globe } from 'lucide-react';

const UserSearchCard = ({ result }) => {
  return (
    <Link
      to={`/profile/${result.username}`}
      className="transform transition-all duration-300 hover:scale-105 h-full group"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl flex flex-col items-center h-full relative overflow-hidden">
        {/* Profile Picture Section */}
        <div className="mb-4 flex justify-center items-center h-32 w-32 relative">
          {result.profilePicture ? (
            <img
              src={result.profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-blue-900 transition-transform group-hover:scale-110"
            />
          ) : (
            <FaUserCircle className="w-full h-full text-blue-950 opacity-80" />
          )}
          {result.verified && (
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
              <Award size={16} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-grow flex flex-col justify-between w-full">
          {/* Username and Name */}
          <div>
            <h2 className="text-2xl font-bold text-blue-950 mb-1 flex items-center justify-center">
              {result.username}
              {result.verified && (
                <span className="ml-2 text-blue-500" title="Verified User">
                  ✓
                </span>
              )}
            </h2>
            <p className="text-gray-700 text-sm mb-2">
              {result.name || 'Name not provided'}
            </p>
          </div>
          
          {/* Bio Section */}
          <div className="min-h-[3rem] mb-4">
            {result.bio ? (
              <p className="text-gray-600 text-sm italic line-clamp-3">
                "{result.bio}"
              </p>
            ) : (
              <p className="text-gray-400 text-sm italic">
                No bio available
              </p>
            )}
          </div>

          {/* View Profile Button */}
          <div>
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold transition-colors group-hover:bg-blue-100">
              View Full Profile
            </div>
          </div>
        </div>

        {/* Optional: Hover Effect Overlay */}
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default UserSearchCard;