import React from 'react';

const SearchItem = ({ item }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'song':
        return '🎵';
      case 'album':
        return '💿';
      case 'artist':
        return '🎤';
      case 'playlist':
        return '📂';
      default:
        return '❓';
    }
  };

  return (
    <div className="search-item">
      <span className="icon">{getIcon(item.type)}</span>
      <span className="name">{item.name}</span>
      <span className="type">{item.type}</span>
    </div>
  );
};

export default SearchItem;