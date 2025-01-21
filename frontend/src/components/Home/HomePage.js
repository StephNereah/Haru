import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);
  const [randomPlaylists, setRandomPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch recommended playlists (mocked for simplicity)
  useEffect(() => {
    axios
      .get("http://localhost:5000/spotify/random_playlists")
      .then((res) => setRandomPlaylists(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    axios
      .get(`http://localhost:5000/spotify/search?query=${searchTerm}`)
      .then((res) => setSearchResults(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="homepage">
      {/* Top Bar */}
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

      {/* Navigation Bar */}
      <aside className="nav-bar">
        <button>Create Playlist</button>
        <div className="user-playlists">
          <h4>Your Playlists</h4>
          {/* Placeholder for user playlists */}
          <p>No playlists yet</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <section className="recommended-playlists">
          <h2>Recommended Playlists</h2>
          <div className="playlist-grid">
            {recommendedPlaylists.map((playlist, index) => (
              <a key={index} href={playlist.url} target="_blank" rel="noopener noreferrer">
                <div className="playlist-card">
                  <p>{playlist.name}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="spotify-playlists">
          <h2>Spotify Playlists</h2>
          <div className="playlist-grid">
            {randomPlaylists.map((playlist, index) => (
              <a key={index} href={playlist.url} target="_blank" rel="noopener noreferrer">
                <div className="playlist-card">
                  <p>{playlist.name}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="search-results">
          <h2>Search Results</h2>
          <div className="playlist-grid">
            {searchResults.map((song, index) => (
              <div key={index} className="playlist-card">
                <p>{song.name} - {song.artist}</p>
                <a href={song.url} target="_blank" rel="noopener noreferrer">Listen</a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;