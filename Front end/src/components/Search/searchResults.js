import React from 'react';
import SearchItem from './SearchItem';

const SearchResults = ({ results, isLoading, error }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <div className="search-results">
      {results.map((item) => (
        <SearchItem key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  );
};

export default SearchResults;