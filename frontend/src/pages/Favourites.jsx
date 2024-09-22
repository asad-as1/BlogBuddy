import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components"; // Import the Error component
import axios from "axios";
import Cookie from "cookies-js";
import Error from "../pages/ErrorPage"

const Favourites = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const token = Cookie.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}user/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPosts(res.data.favourites);
      } catch (error) {
        console.error("Request failed", error);
        setError("Failed to fetch favorites."); // Set the error message
      }
    };

    fetchData();
  }, [token]);

  // Render the Error component if an error occurred
  if (error) {
    return (
      <div className="w-full py-8">
        <Container>
          <Error message={error} />
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(
              (post) =>
                post.isPublished === "Public" && ( // Only render if post is public
                  <div key={post._id} className="p-2">
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
