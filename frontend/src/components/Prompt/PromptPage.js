
import React, { useState } from "react";
import promptGif from "../../assets/prompt.gif";
import axios from "axios";
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
    Anxiety: "One step at a time, you've got this. Just breathe.",
    Romantic: "Love makes everything better. Don't stray away from it!",
    Bored: "Every moment is a chance to create something amazing.",
  };

  const handleMoodClick = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((item) => item !== mood));
    } else if (selectedMoods.length < 3) {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleNext = async () => {
    if (!showQuote) {
      const randomMood = selectedMoods[Math.floor(Math.random() * selectedMoods.length)];
      setQuote(quotes[randomMood] || "You're amazing, keep going!");
      setShowQuote(true);

      try {
        const username = localStorage.getItem("username"); // Retrieve logged-in user
        await axios.post("http://127.0.0.1:5000/save_moods", {
          username,
          moods: selectedMoods,
        });
      } catch (error) {
        console.error("Error saving moods:", error);
      }
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <div className="prompt-page">
      <h1 className="prompt-title">Haru: Music Heals</h1>
      <img src={promptGif} alt="App Logo" className="app-image" />
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
