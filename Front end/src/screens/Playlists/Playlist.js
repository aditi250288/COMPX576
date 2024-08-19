import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Playlist() {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/playlists/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPlaylist(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch playlist. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div className="playlist">
      <h2>{playlist.name}</h2>
      <p>{playlist.description}</p>
      <ul>
        {playlist.songs.map(song => (
          <li key={song.id}>{song.title} - {song.artist}</li>
        ))}
      </ul>
    </div>
  );
}