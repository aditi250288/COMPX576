import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Library() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/');
      setSongs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch songs. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Library</h1>
      {songs.length === 0 ? (
        <p>No songs in the library.</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.id}>{song.title} - {song.artist}</li>
          ))}
        </ul>
      )}
    </div>
  );
}