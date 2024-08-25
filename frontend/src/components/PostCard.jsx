import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";
import axios from "axios";

function PostCard({
  _id,
  title,
  categories,
  comments = [], // Default to empty array
  content,
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

  useEffect(() => {
    // Fetch the current user's profile
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/profile", { withCredentials: true });
        // console.log(res.data.user)
        const currentUserId = res.data.user._id; 
        setUserId(currentUserId);
        setIsLiked(likes.includes(currentUserId));
        const authordata = await axios.post("http://localhost:5000/user/getUserById", {author}, { withCredentials: true });
        setAuthorData(authordata?.data?.user);
        // console.log(authorData.username)
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [likes]);

  const handleLike = async () => {
    if (!userId) return; // Ensure userId is available

    try {
      const endpoint = isLiked
        ? `http://localhost:5000/post/${_id}/unlike`
        : `http://localhost:5000/post/${_id}/like`;

      const res = await axios.post(endpoint, {}, { withCredentials: true });

      if (res.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  return (
    <Link to={`/post/${_id}`}>
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        {/* Media Section */}
        <div className="relative w-full p-4">
          {isVideo ? (
            <video controls  autoPlay muted className="w-full h-48 object-fit">
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={mediaUrl} alt={title} className="w-full h-48 object-fit" />
          )}
        </div>

        {/* Post Details Section */}
        <div className="p-4">
          {/* Title */}
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          
          {/* Likes and Comments */}
          <div className="flex gap-4 items-center mb-2 text-gray-700">
            <button onClick={handleLike} className="flex items-center">
              <FaHeart className={`mr-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} size={20} />
              <span>{likes.length}</span>
            </button>
            <FaComment className='text-gray-400' size={20}/>
            <span>{comments.length}</span>
          </div>

          {/* Uploaded By */} 
          <p className="text-gray-900 text-sm mt-2">Uploaded by: <span className="font-medium">{authorData?.username}</span></p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
