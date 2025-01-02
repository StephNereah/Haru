import React, { useState } from "react";
import promptGif from "../../assets/prompt.gif";
import "./PromptPage.css";

const PromptPage = () => {
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [showQuote, setShowQuote] = useState(false);
    const [quote, setQuote] = useState("");

    const moods = ["Happy", "Sad", "Angry", "Calm", "Excited", "Fear", "Anxiety", "Romantic", "Bored"];
    const quotes = {
        Happy: "Keep smiling and let the world wonder why!",
        Sad: "Life at times can be draining but don't worry cause it shall pass. In the meantime appreciate the small happy moments offer. YOU GOT THIS!!!",
        Angry: "Take a deep breath and let it go. Ask yourself 'is it really worth it?'",
        Calm: "Peace begins with a deep breath.",
        Excited: "Your energy is contagious! Share it around!",
        Fear: "Courage is not the absence of fear but the triumph over it.",
        Anxiety: "One step at a time, you've got this. Just breath.",
        Romantic: "Love makes everything better. Dont stray away from it!",
        Bored: "Every moment is a chance to create something amazing. ",
    };

    const handleMoodClick = (mood) => {
        if (selectedMoods.includes(mood)) {
            setSelectedMoods(selectedMoods.filter((item) => item !== mood));
        } else if (selectedMoods.length < 3) {
            setSelectedMoods([...selectedMoods, mood]);
        }
    };

    const handleNext = () => {
        if (!showQuote) {
            // Show a quote based on selected moods
            const randomMood = selectedMoods[Math.floor(Math.random() * selectedMoods.length)];
            setQuote(quotes[randomMood] || "You're amazing, keep going!");
            setShowQuote(true);
        } else {
            // Redirect to homepage (replace "/home" with your homepage route)
            window.location.href = "/home";
        }
    };

    return (
        <div className="prompt-page">
            <h1 className= "prompt-title">Haru: Music Heals</h1>
            <img src= {promptGif} alt="App Logo" className="app-image" />
            <p className="prompt-question">How are we feeling today?</p>
            <div className="moods">
                {moods.map((mood) => (
                    <button
                        key={mood}
                        className={`mood-button ${selectedMoods.includes(mood) ? "selected" : ""}`}
                        onClick={() => handleMoodClick(mood)}
                    >
                        {mood}
                    </button>
                ))}
            </div>
            {showQuote && <div className="quote">{quote}</div>}
            <button className="next-button" onClick={handleNext}>
                Next
            </button>
        </div>
    );
};

export default PromptPage;
