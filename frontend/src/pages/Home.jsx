import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button } from '../components/index';
import Cookie from "cookies-js";

function Home() {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(null); // Using null to differentiate unverified vs failed
  const [loading, setLoading] = useState(true); // Loading state to manage async data fetching
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null); // Make sure user is null initially
  const [error, setError] = useState(null); // To capture any authentication error
  const token = Cookie.get('token');

  const BACKEND_URL = import.meta.env.VITE_URL;

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        setLoading(true); // Start loading when checking auth
        try {
          const response = await axios.get(`${BACKEND_URL}user/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAuthStatus(true); // User is authenticated
          setLoading(false); // Stop loading after success
        } catch (error) {
          setAuthStatus(false); // User is not authenticated
          setError('Authentication check failed. Please log in.');
          console.error('Authentication check failed', error);
          setLoading(false); // Stop loading after failure
        }
      } else {
        setLoading(false); // Stop loading if no token is present
      }
    };
  
    checkAuth();
  }, [token]);
  

  // Fetch posts only if the user is authenticated
  useEffect(() => {
    if (authStatus) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}post/allPosts`);
          setPosts(res.data);
        } catch (error) {
          console.error('Request failed', error);
        }
      };
      fetchPosts(); 
    }
  }, [authStatus]);

  // Fetch user data if authenticated
  useEffect(() => {
    if (authStatus) {
      const fetchUserData = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          setUser(res?.data?.user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    }
  }, [authStatus, token]);

  // Loading state
  if (loading) {
    return <div className="w-full py-8 mt-4 text-center">Loading...</div>;
  }

  // Display error message if any
  if (error) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap items-center justify-center h-80 mt-4 mb-3">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold text-red-500">
                {error}
              </h1>
              <Button children={"Log In"} onClick={() => { navigate("/login"); }} />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Render a button if no posts exist
  if (authStatus && posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                <Button children={"Add Post"} onClick={() => { navigate("/add-post"); }} />
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Main posts rendering logic based on user role
  return (
    <div className='w-full py-8'>
      <Container>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {posts.map((post) => (
            (user?.role === "admin" || post.isPublished === "Public") && (  // Admin can see all posts, others only public
              <div key={post._id} className='p-2'>
                <PostCard {...post} />
                {user?.role === "admin" && post.isPublished !== "Public" && (  // Show "Private Post" for admin
                  <h2 className='text-center text-xl mt-1'>Private Post</h2>
                )}
              </div>
            )
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
