import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../AudioContext';
import './feed.css';

export default function Feed() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { playSong: playAudio } = useAudio();

  useEffect(() => {
    fetchFeedItems();
  }, []);

  const fetchFeedItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/feed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFeedItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch feed. Please try again later.');
      setLoading(false);
    }
  };

  const playSong = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/songs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      playAudio(response.data);
      navigate('/player', { state: { song: response.data } });
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const viewPlaylist = (id) => {
    navigate(`/playlist/${id}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="feed-container">
      <h1>Your Music Feed</h1>
      {feedItems.length === 0 ? (
        <p>No items in your feed. Try following some artists or playlists!</p>
      ) : (
        <ul className="feed-list">
          {feedItems.map((item) => (
            <li key={item.id} className="feed-item">
              <img src={item.image} alt={item.title} className="feed-item-image" />
              <div className="feed-item-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.type === 'song' && (
                  <button onClick={() => playSong(item.id)}>Play</button>
                )}
                {item.type === 'playlist' && (
                  <button onClick={() => viewPlaylist(item.id)}>View Playlist</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}