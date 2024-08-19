import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAudio } from '../../AudioContext';

export default function Player() {
  const location = useLocation();
  const { currentTrack, isPlaying, playSong, pauseSong } = useAudio();
  const song = location.state?.song || currentTrack;

  if (!song) {
    return <div>No song selected</div>;
  }

  return (
    <div className="player">
      <h2>{song.title}</h2>
      <p>{song.artist}</p>
      <audio 
        src={song.audioUrl} 
        controls 
        autoPlay={isPlaying}
        onPlay={() => playSong(song)}
        onPause={pauseSong}
      />
    </div>
  );
}