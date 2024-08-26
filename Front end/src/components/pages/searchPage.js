import React from 'react';
import SearchBar from '../components/Search/SearchBar';
import SearchResults from '../components/Search/SearchResults';
import useSearch from '../hooks/useSearch';

const SearchPage = () => {
  const { query, results, isLoading, error, handleInputChange } = useSearch();

  return (
    <div className="search-page">
      <h1>Search Music</h1>
      <SearchBar query={query} onChange={handleInputChange} />
      <SearchResults results={results} isLoading={isLoading} error={error} />
    </div>
  );
};

export default SearchPage;