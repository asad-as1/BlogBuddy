import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button } from '../components/index';
import Cookie from "cookies-js";
import { Login } from '../components'


function Home() {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null); 
  const [error, setError] = useState(null); 
  const token = Cookie.get('token');

  const BACKEND_URL = import.meta.env.VITE_URL;

  
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        setLoading(true); // Start loading when checking auth
        try {
          const res = await axios.get(`${BACKEND_URL}user/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAuthStatus(true); 
          setUser(res?.data?.user);
          // console.log(res.data.user)
          setLoading(false); 
        } catch (error) {
          setAuthStatus(false); 
          setError('Authentication check failed. Please log in.');
          console.error('Authentication check failed', error);
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    };
  
    checkAuth();
  }, [token]);
  

 
  useEffect(() => {
    if (authStatus) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}post/allPosts`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          setPosts(res.data);
          // console.log(res.data)
          setUser(res?.data?.user);
        } catch (error) {
          console.error('Request failed', error);
        }
      };
      fetchPosts(); 
    }
  }, [authStatus]);


  // Loading state
  if (loading) {
    return <div className="w-full py-8 mt-4 text-center">Loading...</div>;
  }

  // Display error message if any
  if (!authStatus) {
    return (
      <div className='py-8'>
          <Login />
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