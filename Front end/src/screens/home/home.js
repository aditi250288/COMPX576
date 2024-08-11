import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Library from "../library/library";
import Feed from "../feed/feed";
import Player from "../player/player";
import Favourites from "../fabourites/favourites";
import Trending from "../trending/trending";
import LoginForm from "../LoginForm";

export default function Home() {
    
    return(

    <Router>

    <div className= "main-body">
        
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/library" element={<Library/>}/>
            <Route path="/feed" element={<Feed />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/player" element={<Player />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/feed" element={<Feed />} />

        </Routes>
    </div> 
      
    </Router> 
    
    );
}

//settingScreen file storing name
//SettingScreen component name
