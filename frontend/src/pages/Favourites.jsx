import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";

const Favourites = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/favourites", {
          withCredentials: true,
        });
        setPosts(res.data.favourites);
      } catch (error) {
        console.error("Request failed", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        {posts.length > 0 ? (
          <div className="flex flex-wrap mt-4 justify-center sm:justify-between gap-4">
            {posts.map(
              (post) =>
                post.isPublished === "Public" && ( // Only render if post is public
                  <div key={post._id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <PostCard {...post} />
                  </div>
                )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 mb-12 text-center">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">
              Your favorites list is empty!
            </h2>
            <p className="text-gray-500">
              It looks like you haven't added any posts to your favorites yet.
              Start exploring and add posts to your favorites to see them here.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Favourites;
