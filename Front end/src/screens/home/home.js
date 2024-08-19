import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Library from "../library/library";
import Feed from "../feed/feed";
import Player from "../player/player";
import Favourites from "../favourites/favourites";
import Trending from "../trending/trending";
import Login from "../login/LoginForm";
import Playlist from "../Playlists/Playlist";


export default function Home() {
    return (
        <Router>
            <div className="main-body">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/player" element={<Player />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/Playlists/:id" element={<Playlist />} />
                </Routes>
            </div>
        </Router>
    );
}