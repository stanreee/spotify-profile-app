import React from 'react'

function Playlist({ playlistImgSrc, playlistName, playlistLink, numOfTracks, firstPlaylist, lastPlaylist }) {
    return (
        <a href={playlistLink} target="_blank" style={{marginLeft: firstPlaylist ? "8%" : "0%", marginRight: lastPlaylist ? "8%" : "0%"}}>
            <div className="playlist-card" >
                <img className="playlist-img" src={playlistImgSrc} alt="" />
                <div className="playlist-info">
                    <h1 className="playlist-title">{playlistName}</h1>
                    <h1 className="playlist-tracks">{numOfTracks} songs</h1>
                </div>
            </div>
        </a>
        
    )
}

export default Playlist
