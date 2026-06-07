import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`/users/search?q=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error('Search error', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Search</h2>
        <div className="search-input-container">
          <SearchIcon className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
        </div>
      </div>
      
      <div className="search-results">
        {loading && <div className="search-message">Searching...</div>}
        {!loading && query && results.length === 0 && (
          <div className="search-message">No users found.</div>
        )}
        {!loading && results.map(user => (
          <Link to={`/profile/${user.username}`} key={user.id} className="search-result-item">
            <img src={user.avatar} alt={user.username} className="search-result-avatar" />
            <span className="search-result-username">{user.username}</span>
          </Link>
        ))}
        {!query && (
          <div className="search-message">Type a username or bio to search.</div>
        )}
      </div>
    </div>
  );
};

export default Search;
