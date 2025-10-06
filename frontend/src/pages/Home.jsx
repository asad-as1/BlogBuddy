import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components"; // Import the Error component
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "cookies-js";
import Error from "../pages/ErrorPage";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const token = Cookie.get("token");
  const BACKEND_URL = import.meta.env.VITE_URL;

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await axios.get(`${BACKEND_URL}user/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res?.data?.user);
        } catch (error) {
          setAuthStatus(false);
          setError("Authentication check failed. Please log in.");
          console.error("Authentication check failed", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}post/allPosts`);
        setPosts(res.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch posts. Please try again later.");
        console.error("Request failed", error);
      }
    };
    fetchPosts();
  }, []);

  // Loading state
  if (loading) {
    return <div className="w-full py-8 mt-4 text-center">Loading...</div>;
  }

  // Display error message if any
  if (error) {
    return (
      <Container>
        <Error message={error} />
      </Container>
    );
  }

  // Main posts rendering logic based on user role

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(
            (post) =>
              (user?.id === post?.author || user?.role === "admin" || post?.isPublished === "Public") && ( // Admin can see all posts, others only public
                <div key={post._id} className="p-2">
                  <PostCard {...post} />
                  {(user?.role === "admin" || user?.id === post?.author) &&
                    post.isPublished !== "Public" && ( // Show "Private Post" for admin
                      <h2 className="text-center text-xl mt-1">Private Post</h2>
                    )}
                </div>
              )
          )}
        </div>
      </Container>
    </div>
  );
}

export default Home;