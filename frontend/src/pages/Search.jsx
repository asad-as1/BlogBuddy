import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import {PostCard } from '../components';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(''); // To track whether searching for 'user' or 'post'
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState([]); // To store search results
  const [error, setError] = useState(''); // To store any error message

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setHasSubmitted(false); // Reset submission state when user types
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setHasSubmitted(false); // Reset submission state when user changes search type
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
      const url = `http://localhost:5000/${searchType === 'user' ? 'user' : 'post'}/search`;

      // Fetch data from the API
      // console.log(url)
      const response = await axios.get(url, {
        params: {
          query: trimmedQuery
        },
        withCredentials: true // Include credentials in the request
      });
      console.log(response)
      setQuery("")
      setResults(response.data); // Store search results
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch results. Please try again later.'); // Set error message
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 flex-col">
      {/* Search Type Selection */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSearchTypeChange('user')}
          className={`px-4 py-2 rounded-lg ${
            searchType === 'user'
              ? 'bg-blue-900 text-white'
              : 'bg-gray-300 text-gray-700'
          } focus:outline-none`}
        >
          User
        </button>
        <button
          onClick={() => handleSearchTypeChange('post')}
          className={`px-4 py-2 rounded-lg ${
            searchType === 'post'
              ? 'bg-blue-900 text-white'
              : 'bg-gray-300 text-gray-700'
          } focus:outline-none`}
        >
          Post
        </button>
      </div>

      {/* Display the chosen search type */}
      <div className="mb-4 text-gray-700">
        {searchType
          ? `You are searching for ${searchType === 'user' ? 'users' : 'posts'}.`
          : 'What do you want to search for?'}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder={`Search for ${searchType || '...'} by tag or name...`}
          value={query}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!searchType} // Disable input if no search type is selected
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 ${
            query && searchType
              ? 'bg-blue-900 hover:bg-blue-600 focus:ring-blue-500'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!query || !searchType} // Disable button if input is empty or search type is not selected
        >
          Search
        </button>
      </form>

      {/* Display search results or messages */}
      {error && (
        <div className="h-80 flex justify-center items-center mb-3 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
      {!hasSubmitted && (
        <div className="h-80 flex justify-center items-center mb-3 text-center text-gray-500">
          <p>🌟 Start your search journey! 🌟</p>
          <p>
            Select whether you're searching for a user or a post, then discover
            content by tags or explore users by their names.
          </p>
        </div>
      )}
      {hasSubmitted && results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Results:</h2>
          <ul className="list-disc pl-5">
            {results.map((result, index) => (
              <div key={index} className="mb-2">
                {searchType === 'user'
                  ? `User: ${result.username || result.fullName}`
                  :  <PostCard {...result} />}
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
