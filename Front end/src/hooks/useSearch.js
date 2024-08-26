import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; // You'll need to install lodash: npm install lodash
import { searchService } from '../services/searchService';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await searchService.search(searchQuery);
        setResults(searchResults);
      } catch (err) {
        setError('An error occurred while searching. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return { query, results, isLoading, error, handleInputChange };
};

export default useSearch;