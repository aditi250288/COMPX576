import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Library from "../library/library";
import Feed from "../feed/feed";
import Player from "../player/player";
import Favourites from "../favourites/favourites";
import Trending from "../trending/trending";
import Login from "../login/LoginForm";
import Playlist from "../Playlists/Playlist";
import ProtectedRoute from "../../components/protectedRoutes";
import Register from "../register/register";

export default function Home() {
    return (
        <Router>
            <div className="main-body">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} /> {/* Add this line */}
                    <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                    <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                    <Route path="/trending" element={<ProtectedRoute><Trending /></ProtectedRoute>} />
                    <Route path="/player" element={<ProtectedRoute><Player /></ProtectedRoute>} />
                    <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
                    <Route path="/Playlists/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}