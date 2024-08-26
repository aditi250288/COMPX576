import React from 'react';

const SearchBar = ({ query, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for songs, albums, artists, or playlists"
        value={query}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;