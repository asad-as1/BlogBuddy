import React, { useState, useRef } from "react"; // Added useRef
import axios from "axios";
import { PostCard } from "../components";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Cookie from "cookies-js";
import UserSearchCard from "../components/UserSearchCard";

const Search = () => {
  const token = Cookie.get("token");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("user");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [noDataFound, setNoDataFound] = useState(false);

  // Add a reference to the input field
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setHasSubmitted(false);
    setNoDataFound(false);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setHasSubmitted(false);
    setNoDataFound(false);
    setResults([]);
  };

  const handleClearSearch = () => {
    // Clear the query state
    setQuery("");

    // Reset search type to user
    setSearchType("user");

    // Reset other states
    setHasSubmitted(false);
    setResults([]);
    setNoDataFound(false);

    // Focus the input field after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const trimmedQuery = query.trim();

    if (!trimmedQuery || !searchType) {
      return;
    }

    try {
      const url = `${import.meta.env.VITE_URL}${
        searchType === "user" ? "user" : "post"
      }/search`;

      const response = await axios.get(url, {
        params: { query: trimmedQuery },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // console.log(response);

      setResults(response.data);
      setQuery("");
      setError("");
      setNoDataFound(response.data.length === 0);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch results. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        {/* Search Type Selection */}
        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            {["user", "post"].map((type) => (
              <button
                key={type}
                onClick={() => handleSearchTypeChange(type)}
                className={`
                  px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider 
                  transition-all duration-300 ease-in-out transform hover:scale-105
                  ${
                    searchType === type
                      ? "bg-blue-900 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Guidance */}
          <p className="text-center text-gray-600 mt-4 text-sm italic">
            {searchType
              ? `Searching for ${searchType === "user" ? "users" : "posts"}`
              : "Select search type to begin"}
          </p>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center mb-6 relative"
        >
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search for ${
                searchType ? searchType + "s" : "..."
              }`}
              value={query}
              onChange={handleSearchChange}
              disabled={!searchType}
              className={`
                w-full pl-12 pr-12 py-3 rounded-full border-2 
                ${
                  !searchType
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                    : "border-blue-900 focus:ring-2 focus:ring-blue-500"
                }
                text-black transition-all duration-300
              `}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            {query && (
              <FaTimes
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={!query || !searchType}
            className={`
              ml-4 px-6 py-3 rounded-full text-white 
              transition-all duration-300 
              ${
                query && searchType
                  ? "bg-blue-900 hover:bg-blue-700 active:scale-95"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Search
          </button>
        </form>

        {/* Results or Message Area */}
        <div className="mt-8">
          {error && (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {!hasSubmitted && (
            <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
              <p className="text-2xl mb-4">🔍 Start Your Search Journey</p>
              <p className="text-sm">
                By default, search for users or switch to posts.
              </p>
            </div>
          )}

          {hasSubmitted && noDataFound && (
            <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
              <p className="text-xl">No results found</p>
              <p className="text-sm mt-2">
                Try a different search term or adjust your criteria.
              </p>
            </div>
          )}

          {hasSubmitted && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {results.map((result, index) => {
                return searchType === "user" ? (
                  <UserSearchCard key={index} result={result} />
                ) : (
                  result?.isPublished !== "Private" && (
                    <div
                      key={index}
                      className="transform transition-all duration-300"
                    >
                      <PostCard {...result} />
                    </div>
                  )
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
