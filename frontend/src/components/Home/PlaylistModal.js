import React, { useState } from 'react';

function PlaylistModal({ isOpen, onClose, onSubmit }){
    const [playlistName, setPlaylistName] = useState("");

    const handleSubmit = () => {
        if (playlistName.trim()) {
            onSubmit(playlistName);
            setPlaylistName("");
            onClose();
        }
    };
    if (!isOpen) return null;

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h2>Create Playlist</h2>
                <input type='text' placeholder='Enter playlist name' value={playlistName} onChange={(e) => setPlaylistName(e.target.value)}/>
                <button onClick={handleSubmit}>Create</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}



export default PlaylistModal;
