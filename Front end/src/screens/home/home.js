import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Library from "../library/library";
import Feed from "../feed/feed";
import Player from "../player/player";
import Favourites from "../favourites/favourites";
import Trending from "../trending/trending";
import Login from "../login/LoginForm";
import Playlist from "../Playlists/Playlist";
import ProtectedRoute from "../../components/protectedRoutes";
import Register from "../register/register";
import NotFound from "../../components/notFound/notFound";

export default function Home() {
    return (
        <Router>
            <div className="main-body">
                <Routes>
                    <Route path="/" element={<Navigate replace to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                    <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                    <Route path="/trending" element={<ProtectedRoute><Trending /></ProtectedRoute>} />
                    <Route path="/player" element={<ProtectedRoute><Player /></ProtectedRoute>} />
                    <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
                    <Route path="/playlists/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}