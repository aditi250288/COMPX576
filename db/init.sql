-- Create the database
CREATE DATABASE IF NOT EXISTS music_website;
USE music_website;
   

-- Create a users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified Boolean DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the artists table
CREATE TABLE IF NOT EXISTS artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    image VARCHAR(255),
    followers int, 
    genre VARCHAR(50)

);

-- Create the albums table
CREATE TABLE IF NOT EXISTS albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    album_name VARCHAR(100) NOT NULL,
    artist_id INT,
    release_date DATE,
    total_songs INT,
    image VARCHAR(255),
    genre VARCHAR(50),
    popularity VARCHAR(50),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_name VARCHAR(100) NOT NULL,
    user_id INT,
    image VARCHAR (255),
    d_created DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the songs table
CREATE TABLE IF NOT EXISTS songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    song_title VARCHAR(100) NOT NULL,
    album_id INT,
    artist_id INT,
    url VARCHAR (255),
    duration INT,
    release_date DATE,
    playlist_id INT,

    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE SET NULL,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE SET NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE SET NULL
);



-- Create a likes table
CREATE TABLE IF NOT EXISTS likes (
    user_id INT,
    song_id INT,
    album_id INT,
    playlist_id INT,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS album_artists (
    artist_id INT,
    album_id INT,
    PRIMARY key (artist_id, album_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE

);

Create table IF NOT EXISTS playlist_song(
    playlist_id int,
    song_id,
    PRIMARY key(playlist_id,song_id),
    FOREIGN key(playlist_id) REFERENCES playlists(playlist_id),
    FOREIGN key(song_id) REFERENCES songs(song_id)
);


