import React, { useEffect, useState } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
});

const Library = () => {
  const [libraryData, setLibraryData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLibraryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axiosInstance.get('/spotify/library', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLibraryData(response.data);
    } catch (error) {
      console.error('Error fetching library data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch library data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const renderTracks = () => (
    <div>
      <h2>Tracks</h2>
      <ul>
        {libraryData.tracks.map(track => (
          <li key={track.track.id}>{track.track.name}</li>
        ))}
      </ul>
    </div>
  );

  const renderAlbums = () => (
    <div>
      <h2>Albums</h2>
      <ul>
        {libraryData.albums.map(album => (
          <li key={album.album.id}>{album.album.name}</li>
        ))}
      </ul>
    </div>
  );

  const renderPlaylists = () => (
    <div>
      <h2>Playlists</h2>
      <ul>
        {libraryData.playlists.map(playlist => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchLibraryData}>Retry</button>
      </div>
    );
  }

  if (!libraryData) {
    return <div>No library data available.</div>;
  }

  return (
    <div>
      <h1>Your Library</h1>
      {libraryData.tracks && renderTracks()}
      {libraryData.albums && renderAlbums()}
      {libraryData.playlists && renderPlaylists()}
    </div>
  );
};

export default Library;