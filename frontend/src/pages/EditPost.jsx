import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function EditPost() {
    const location = useLocation();
    const pathname = location.pathname;
    const postId = pathname.split('/')[2];

    const [post, setPost] = useState(null)

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
            }
        };
        fetchPostData()
    }, [])

  return post ? (
    <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost