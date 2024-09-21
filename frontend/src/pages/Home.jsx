import React, { useEffect, useState } from 'react';
import { Container, PostCard, Login } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button } from '../components/index';
import Cookie from "cookies-js";
import { isTokenValid } from '../components/auth';

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null); 
  const [error, setError] = useState(null); 
  const token = Cookie.get('token');

  const BACKEND_URL = import.meta.env.VITE_URL;


  const isAuthenticated = isTokenValid();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}post/allPosts`);
          // console.log(res, "post")
          setPosts(res.data);
        } catch (error) {
          console.error('Request failed', error);
        }
      };
      fetchPosts();

      const fetchUserData = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          // console.log(res, "user")
          setUser(res?.data?.user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    } 
    else {
      setLoading(false); 
      navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

 
  // if (loading) {
  //   return <div className="w-full py-8 mt-4 text-center">Loading...</div>;
  // }

  // if (error) {
  //   return (
  //     <Login/>
  //   );
  // }

  if (posts.length === 0) {
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
