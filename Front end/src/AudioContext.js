import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song) => {
    setCurrentTrack(song);
    setIsPlaying(true);
    // Here you would also trigger actual audio playback
  };

  const pauseSong = () => {
    setIsPlaying(false);
    // Here you would pause the actual audio playback
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playSong, pauseSong }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);