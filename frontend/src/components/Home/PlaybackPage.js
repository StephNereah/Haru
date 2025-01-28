import React from "react";
import { useLocation } from "react-router-dom";
import "./PlaybackPage.css"

const PlaybackPage = () => {
  const location = useLocation();
  const { song } = location.state || {};

  if (!song) {
    return <p>No song selected. Please go back and choose a song.</p>;
  }

  return (
    <div className="playback-page">
      <h2>Now Playing</h2>
      <div className="player">
        <img src={song.album_cover} alt={`${song.name} album cover`} />
        <h3>{song.name}</h3>
        <p>{song.artist}</p>
        <iframe
          src={`https://open.spotify.com/embed/track/${song.url.split("/").pop()}`}
          width="300"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          title={`Spotify player for ${song.name} by ${song.artist}`}
        ></iframe>
      </div>
    </div>
  );
};

export default PlaybackPage;