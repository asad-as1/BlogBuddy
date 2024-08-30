import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";

function Profile() {
  const [posts, setPost] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        setUser(res.data);
        //   setPost(res.data.user.posts)
        //   console.log(posts)
        console.log(res);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();

  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Profile;
