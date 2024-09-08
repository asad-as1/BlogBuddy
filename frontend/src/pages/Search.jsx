import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { PostCard, Container } from "../components";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState(""); // To track whether searching for 'user' or 'post'
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState([]); // To store search results
  const [error, setError] = useState(""); // To store any error message
  const [noDataFound, setNoDataFound] = useState(false); // To track if no data found

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setHasSubmitted(false); // Reset submission state when user types
    setNoDataFound(false); // Reset no data found when user types
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setHasSubmitted(false); // Reset submission state when user changes search type
    setNoDataFound(false); // Reset no data found when search type changes
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Trim the query to remove any leading or trailing whitespace
    const trimmedQuery = query.trim();

    if (!trimmedQuery || !searchType) {
      return; // Prevent empty search or search without selecting type
    }

    try {
      // Set the URL based on searchType
      const url = `http://localhost:5000/${
        searchType === "user" ? "user" : "post"
      }/search`;

      // Fetch data from the API
      const response = await axios.get(url, {
        params: {
          query: trimmedQuery,
        },
        withCredentials: true, // Include credentials in the request
      });

      setQuery("");
      setResults(response.data); // Store search results
      setError(""); // Clear any previous errors
      setNoDataFound(response.data.length === 0); // Check if data is empty
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch results. Please try again later."); // Set error message
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 flex-col">
      {/* Search Type Selection */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSearchTypeChange("user")}
          className={`px-4 py-2 rounded-lg ${
            searchType === "user"
              ? "bg-blue-900 text-white"
              : "bg-gray-300 text-gray-700"
          } focus:outline-none`}
        >
          User
        </button>
        <button
          onClick={() => handleSearchTypeChange("post")}
          className={`px-4 py-2 rounded-lg ${
            searchType === "post"
              ? "bg-blue-900 text-white"
              : "bg-gray-300 text-gray-700"
          } focus:outline-none`}
        >
          Post
        </button>
      </div>

      {/* Display the chosen search type */}
      <div className="mb-4 text-gray-600">
        {searchType
          ? `You are searching for ${
              searchType === "user" ? "users" : "posts"
            }.`
          : "What do you want to search for?"}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleSearchChange}
          className="px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
          disabled={!searchType} // Disable input if no search type is selected
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 ${
            query && searchType
              ? "bg-blue-900 hover:bg-blue-600 focus:ring-blue-500"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          disabled={!query || !searchType} // Disable button if input is empty or search type is not selected
        >
          Search
        </button>
      </form>

      {/* Display search results or messages */}
      {error && (
        <div className="h-80 flex justify-center items-center mb-3 text-center text-red-500 px-4 sm:px-6 lg:px-8">
          <p className="text-sm sm:text-base lg:text-lg">{error}</p>
        </div>
      )}
      {!hasSubmitted && (
        <div className="h-80 flex flex-col justify-center items-center mb-3 text-center text-gray-500 px-4 sm:px-6 lg:px-8">
          <p className="text-base sm:text-lg lg:text-xl">
            🌟 Start your search journey! 🌟
          </p>
          <p className="text-sm sm:text-base lg:text-lg mt-2">
            Select whether you're searching for a user or a post, then discover
            content by tags or explore users by their names.
          </p>
        </div>
      )}
      {hasSubmitted && noDataFound && (
        <div className="h-80 flex justify-center items-center mb-3 text-center text-gray-500 px-4 sm:px-6 lg:px-8">
          <p className="text-base sm:text-lg lg:text-xl">
            No data found. Try searching with different criteria.
          </p>
        </div>
      )}

      {hasSubmitted && results.length > 0 && (
        <div className="w-full py-8">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) =>
                searchType === "user" ? (
                  <Link
                    to={`/profile/${result.username}`}
                    key={index}
                    className="p-2"
                  >
                    <div className="p-6 sm:p-8 bg-white shadow-xl rounded-lg border border-gray-300">
                      <div className="flex flex-col justify-between items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Profile Picture or User Icon */}
                        {result.profilePicture ? (
                          <img
                            src={result.profilePicture}
                            alt="Profile"
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-900"
                          />
                        ) : (
                          <FaUserCircle className="w-24 h-24 sm:w-32 sm:h-32 text-blue-950" />
                        )}
                        <div className="text-center sm:text-left">
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                            {result.username}
                          </h2>
                          <p className="text-gray-900 text-lg mt-2">
                            {result.name}
                          </p>
                          {result.bio && (
                            <p className="text-gray-900 text-lg">
                              <strong className="text-blue-950">Bio:</strong>{" "}
                              {result.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  result.isPublished === "Public" && (
                    <div key={index} className="p-2">
                      <PostCard {...result} />
                    </div>
                  )
                )
              )}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default Search;
