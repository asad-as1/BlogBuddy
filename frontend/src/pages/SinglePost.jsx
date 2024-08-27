import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import axios from "axios";
import { FaHeart, FaComment, FaUser } from "react-icons/fa";

export default function SinglePost() {
  const location = window.location.href.split("/");
  const id = location[4];
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likesList, setLikesList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(false); // Validation state
  const [addedFav, setAddedFav] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/post/${id}`);
        setPost(res?.data);
        setIsLiked(res?.data?.likes?.includes(loggedInUserId));
        setLikeCount(res?.data?.likes?.length || 0);
      } catch (error) {
        console.error("Request failed", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        setLoggedInUserId(res?.data?.user?._id);
        setLoggedInUserRole(res?.data?.user?.role); // Set user role
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
    fetchPostData();
  }, [id, loggedInUserId]);

  const handleLike = async () => {
    if (!loggedInUserId) return;

    try {
      const endpoint = isLiked
        ? `http://localhost:5000/post/${id}/unlike`
        : `http://localhost:5000/post/${id}/like`;

      const res = await axios.post(endpoint, {}, { withCredentials: true });

      if (res.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
        fetchLikesList();
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const fetchLikesList = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/post/${id}/likes`);
      setLikesList(res?.data?.likes);
    } catch (error) {
      console.error("Failed to fetch likes list:", error);
    }
  };

  const fetchCommentsList = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/post/${id}/comments`);
      setCommentsList(res?.data?.comments);
    } catch (error) {
      console.error("Failed to fetch comments list:", error);
    }
  };

  const handleAddComment = async () => {
    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setIsCommentEmpty(true); // Show validation message
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/post/${id}/comment`,
        { comment: trimmedComment },
        { withCredentials: true }
      );
      setCommentText("");
      setIsCommentEmpty(false); // Hide validation message
      fetchCommentsList();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const addPostToFavorites = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/favourites/${post?._id}`,
        { withCredentials: true }
      );
      // console.log(res)
      if (res.status == 200) {
        setAddedFav(true);
      }
      alert("Post Added Successfully in Your Favourites");
    } catch (error) {
      console.error("Failed to add in Favourites:", error);
    }
  };

  const checkIfPostIsFavorite = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/favourites/check/${id}`,
        { withCredentials: true }
      );
      if (res?.data?.isFavourite) setAddedFav(res?.data?.isFavourite);
    } catch (error) {
      console.error("Failed to check Favourites:", error);
    }
  };
  checkIfPostIsFavorite();

  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/post/${id}`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/post/${id}/comment/${commentId}`,
        {
          withCredentials: true,
        }
      );
      fetchCommentsList();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const isAuthor = loggedInUserId === post?.author?._id;
  const isAdmin = loggedInUserRole === "admin"; // Check if user is admin

  useEffect(() => {
    fetchLikesList();
    fetchCommentsList();
  }, [id]);

  return post ? (
    <div className="py-8">
      <Container>
        {/* Post Media */}
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-5 bg-white shadow-lg">
          {post?.media?.isVideo ? (
            <video
              controls
              autoPlay
              loop
              className="rounded-xl w-full h-auto max-h-96 object-cover"
            >
              <source src={post?.media?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post?.media?.url}
              alt={post?.title}
              className="rounded-xl w-full h-auto max-h-96 object-cover"
            />
          )}
        </div>

        {/* Post Details */}
        <div className="w-full mb-6">
          <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
          <div className="w-full mb-6 text-gray-800 leading-relaxed">
            {parse(post?.content || "")}
          </div>
          <p className="mb-4 flex items-center">
            Posted by :
            <Link
              to={`/profile/${post?.author?._id}`}
              className="ml-2 font-semibold"
            >
              {post?.author?.username}
            </Link>
          </p>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center mt-4 mb-6">
          {addedFav !== true && (
            <Button
              bgColor="bg-blue-500"
              className="mr-3"
              onClick={() => addPostToFavorites(post?._id)} 
            >
              Add To Favourites
            </Button>
          )}
          {(isAuthor || isAdmin) && ( // Show delete button if the user is the author or an admin
            <>
              <Link to={`/edit-post/${post._id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </>
          )}
        </div>

        {/* Post Stats: Likes and Comments Sections */}
        <div className="flex gap-8 mb-4">
          {/* Likes Section */}
          <div className="w-1/2">
            <div className="flex items-center ">
              <FaHeart
                onClick={handleLike}
                className={`mr-2 mb-3 cursor-pointer ${
                  isLiked ? "text-red-500" : "text-gray-400"
                }`}
                size={20}
              />
              <h2 className="text-xl font-bold mb-4">Likes ({likeCount})</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md h-72 overflow-y-auto">
              {likesList.length > 0 ? (
                likesList.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-around p-1 gap-2 mb-2"
                  >
                    <Link
                      to={`/profile/${user._id}`}
                      className="flex items-center gap-2 w-1/2"
                    >
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-8 h-8 text-gray-600" />
                      )}
                      <span className="mt-4 text-lg">{user.username}</span>
                    </Link>

                    <div>
                      <Button bgColor="bg-blue-500" className="ml-4">
                        <Link to={`/profile/${user._id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No Likes Yet</p>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="w-1/2">
            <div className="flex items-center">
              <FaComment className="mr-2 mb-3 text-gray-400 text-xl" />
              <h2 className="text-xl font-bold mb-4">
                Comments ({commentsList.length || 0})
              </h2>
            </div>
            <div className="relative bg-gray-100 p-4 rounded-lg shadow-md h-72 overflow-y-auto">
              {commentsList.length > 0 ? (
                commentsList.map((comment) => (
                  <div key={comment._id} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {comment.user.profileImage ? (
                        <img
                          src={comment.user.profileImage}
                          alt={comment.user.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-6 h-6 text-gray-500" />
                      )}
                      <span className="font-semibold">
                        @{comment.user.username}
                      </span>
                    </div>
                    <p className="text-gray-700 break-words bg-gray-300 p-2 rounded-lg mb-2">
                      {comment.comment}
                    </p>
                    {(comment?.user?._id === loggedInUserId ||
                      loggedInUserRole === "admin") && (
                      <div className="w-full flex justify-end">
                        <Button
                          bgColor="bg-blue-500"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="ml-4"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No Comments Yet</p>
              )}
            </div>

            {/* Add Comment Section */}
            <div className="bottom-0 left-0 w-full p-4 bg-gray-100 rounded-lg mt-3 flex flex-col gap-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow w-full p-2 border rounded-md"
                required
              />

              {/* Error Message */}
              {isCommentEmpty && (
                <p className="text-red-500 text-sm mt-1">Write Something !</p>
              )}
              <div className="flex justify-end">
                <Button
                  bgColor="bg-blue-500"
                  className="text-sm w1/2 py-2 rounded-md"
                  onClick={handleAddComment}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
