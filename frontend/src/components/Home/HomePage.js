import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "./PlaylistModal";
import axios from "axios";
import "./HomePage.css";

const MoodButton = ({ mood, onClick }) => (
  <button className="mood-option" onClick={() => onClick(mood)}>
    {mood}
  </button>
);

const PlaylistCard = ({ playlist }) => (
  <div className="playlist-card">
    <p>{playlist.name}</p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate(); // To navigate to PlaybackPage
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [randomPlaylists, setRandomPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [moodButtonsVisible, setMoodButtonsVisible] = useState(false);

  //const userId = 1; // Replace with actual user ID from session/localStorage.

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          `https://haru-fvda.onrender.com/spotify/random_playlists`
        );
        setRandomPlaylists(response.data);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    axios
      .get(`https://haru-fvda.onrender.com/spotify/search?query=${searchTerm}`)
      .then((res) => setSearchResults(res.data))
      .catch((err) => console.error(err));
  };

  const handleMoodClick = async (mood) => {
    console.log(`Mood selected: ${mood}`);
    try {
      const response = await axios.post("https://haru-fvda.onrender.com/spotify/recommend_by_mood", {
        mood: mood,
      });
      if (response.status === 200 && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        console.error("No mood-based recommendations found");
        alert("No recommendations found for this mood. Try another mood!");
      }
    } catch (error) {
      console.error("Error fetching mood recommendations:", error);
      alert("Failed to fetch recommendations. Please try again.");
    }
  };

  const handleListenClick = (song) => {
    navigate("/playback", { state: { song } });
  };

  const moods = [
    "Happy",
    "Sad",
    "Angry",
    "Calm",
    "Excited",
    "Fear",
    "Anxiety",
    "Romantic",
    "Bored",
  ];

  return (
    <div className="homepage">
      <header className="top-bar">
        <div className="logo">HARU</div>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for songs or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="user-icon">👤</div>
      </header>

      <aside className="nav-bar">
        <button onClick={() => setIsModalOpen(true)}>Create Playlist</button>
        <PlaylistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <button
          className="mood-button"
          onClick={() => setMoodButtonsVisible((prev) => !prev)}
        >
          Select a Mood
        </button>

        {moodButtonsVisible && (
          <div className="mood-container">
            {moods.map((mood, index) => (
              <MoodButton key={index} mood={mood} onClick={handleMoodClick} />
            ))}
          </div>
        )}

        <div className="user-playlists">
          <h4>Your Playlists</h4>
          {randomPlaylists.length > 0 ? (
            randomPlaylists.map((playlist) => (
              <p key={playlist.id}>{playlist.name}</p>
            ))
          ) : (
            <p>No playlists available</p>
          )}
        </div>
      </aside>

      <main className="content">
        <section className="spotify-playlists">
          <h2>Spotify Playlists</h2>
          <div className="playlist-grid">
            {randomPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        <section className="search-results">
          <h2>
            {searchResults.length > 0 ? "Song Recommendations" : "No Results Found"}
          </h2>
          <div className="playlist-grid">
            {searchResults.length > 0 ? (
              searchResults.map((song, index) => (
                <div key={index} className="playlist-card">
                  {song.album_cover && (
                    <img
                      src={song.album_cover}
                      alt={`${song.name} album cover`}
                      className="album-cover"
                    />
                  )}
                  <p>
                    {song.name} - {song.artist}
                  </p>
                  <button
                    onClick={() => handleListenClick(song)}
                    className="listen-button"
                  >
                    Listen
                  </button>
                </div>
              ))
            ) : (
              <p>No search results found</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
