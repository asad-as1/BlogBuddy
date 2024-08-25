import React, {useEffect, useState} from 'react'
import {Container, PostCard} from '../components'
import {Button} from '../components/index'
import { useNavigate } from 'react-router-dom';
import Cookie from "cookies-js"
import axios from "axios"

function Home() {
const navigate = useNavigate()
  const [authStatus, setAuthStatus] = useState(false);
  const token = Cookie.get('token')

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
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get('http://localhost:5000/post/allPosts');
            // console.log(res.data);
            setPosts(res.data)
          } catch (error) {
            console.error('Request failed', error);
          }
        };
    
        fetchData(); // Call the async function inside useEffect
      }, []); // The empty array ensures this runs only once on mount
  
    if(authStatus && posts.length == 0){
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                <Button children={"AddPost"} onClick= {()=>{navigate( "/add-post")}}/>
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    if (!authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post._id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home