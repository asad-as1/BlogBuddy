import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button } from '../components/index';
import Cookie from "cookies-js";

function Home() {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(false);
  const token = Cookie.get('token');

  useEffect(() => {
    if (token) {
      axios.get('/user/check-auth', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setAuthStatus(true); // User is authenticated
      })
      .catch(error => {
        setAuthStatus(false); // User is not authenticated
        console.error('Authentication check failed', error);
      });
    }
  }, [token]);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/post/allPosts');
        setPosts(res.data);
      } catch (error) {
        console.error('Request failed', error);
      }
    };

    fetchData(); 
  }, []); 

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

  if (!authStatus) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap items-center justify-center h-80 mt-4 mb-3">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                <Button children={"Log In to See Posts"} onClick={() => { navigate("/login"); }} />
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
        <div className='flex flex-wrap mt-4 justify-around'>
          {posts.map((post) => (
            (post.isPublished === "Public") && ( // Only render if post is public
              <div key={post._id} className='p-2 w-1/3'>
                <PostCard {...post} />
              </div>
            )
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
