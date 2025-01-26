import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "./components/Auth/LoginRegister";
import PromptPage from "./components/Prompt/PromptPage";
import HomePage from "./components/Home/HomePage";
import PlaybackPage from "./components/Home/PlaybackPage";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginRegister />} />
                <Route path="/prompt" element={<PromptPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/playback" element={<PlaybackPage />} />
            </Routes>
        </Router>
    );
}

export default App;
