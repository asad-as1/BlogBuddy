import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";
import axios from "axios";
import Cookie from "cookies-js";

function PostCard({
  _id,
  title,
  comments = [], // Default to empty array
  isPublished,
  likes = [], // Default to empty array
  media,
  author,
}) {
  const [userId, setUserId] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const isVideo = media?.isVideo;
  const mediaUrl = typeof media === "string" ? media : media?.url;

  const navigate = useNavigate();
  const token = Cookie.get("token");

  useEffect(() => {
    // Fetch the current user's profile
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_URL}user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          const currentUserId = res?.data?.user?._id;
          setUserId(currentUserId);
          setIsLiked(likes.includes(currentUserId));
          const authordata = await axios.post(
            `${import.meta.env.VITE_URL}user/getUserById`,
            { author },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          setAuthorData(authordata?.data?.user);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [likes, author]);

  const handleLike = async () => {
    if (!userId) return; // Ensure userId is available

    try {
      const endpoint = isLiked
        ? `${import.meta.env.VITE_URL}post/${_id}/unlike`
        : `${import.meta.env.VITE_URL}post/${_id}/like`;

      const res = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  // Conditionally render the PostCard only if the post is published as "Public"
  // if (isPublished !== "Public") return null;

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <Link to={`/post/${_id}`}>
        {/* Media Section */}
        <div className="relative w-full p-4">
          {isVideo ? (
            <video
              controls
              autoPlay
              muted
              loop
              loading="lazy"
              className="w-full h-48 object-fit shadow-lg"
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={title}
              loading="lazy"
              className="w-full h-48 object-fit shadow-xl"
            />
          )}
        </div>
      </Link>

      {/* Post Details Section */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-xl text-black font-semibold mb-2">{title}</h2>

        {/* Likes */}
        <div className="flex gap-4 items-center mb-2 text-gray-700">
          <button className="flex items-center">
            <FaHeart
              onClick={handleLike}
              className={`mr-2 ${isLiked ? "text-red-500" : "text-gray-400"}`}
              size={20}
            />
            <span>{likeCount}</span>
          </button>
        </div>

        {/* Uploaded By */}
        <p className="text-gray-600 text-sm mt-2">
          Uploaded by:
          <span className="font-medium"> @{authorData?.username}</span>
        </p>
      </div>
    </div>
  );
}

export default PostCard;
