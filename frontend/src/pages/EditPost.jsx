import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components"; 
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookie from "cookies-js";
import Swal from "sweetalert2"; // Import SweetAlert2
import withReactContent from "sweetalert2-react-content"; // Import React support for SweetAlert2
import Error from "../pages/ErrorPage";

const MySwal = withReactContent(Swal); // Initialize SweetAlert2 with React

function EditPost() {
  const token = Cookie.get("token");
  const location = useLocation();
  const pathname = location.pathname;
  const postId = pathname.split("/")[2];

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPost(res?.data);
      } catch (error) {
        console.error("Request failed", error);
        setError("Failed to fetch post data"); // Set the error message
        // Show error alert with SweetAlert
        MySwal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch post data. Please try again.',
          confirmButtonColor: '#3085d6', // Blue button color
          confirmButtonText: 'OK',
        });
      }
    };
    fetchPostData();
  }, [postId, token]);

  const handleUpdatePost = async (updatedData) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}post/${postId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        // Show success alert with SweetAlert
        MySwal.fire({
          icon: 'success',
          title: 'Post Updated!',
          text: 'Your post has been successfully updated.',
          confirmButtonColor: '#3085d6', // Blue button color
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error("Post update failed", error);
      // Show error alert with SweetAlert
      MySwal.fire({
        icon: 'error',
        title: 'Update Failed!',
        text: 'An error occurred while updating the post.',
        confirmButtonColor: '#d33', // Red button for retry
        confirmButtonText: 'Retry',
      });
    }
  };

  // Render the Error component if an error occurred
  if (error) {
    return (
      <div className="py-8">
        <Container>
          <Error message={error} />
        </Container>
      </div>
    );
  }

  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} onSubmit={handleUpdatePost} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
