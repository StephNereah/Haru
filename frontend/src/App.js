import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "./components/Auth/LoginRegister";
import PromptPage from "./components/Prompt/PromptPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginRegister />} />
                <Route path="/prompt" element={<PromptPage />} />
            </Routes>
        </Router>
    );
}

export default App;
