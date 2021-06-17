import React from 'react'
import { useTransition, animated } from 'react-spring';

function Playlist({ playlistImgSrc, playlistName, playlistLink, numOfTracks, firstPlaylist, lastPlaylist }) {

    const firstAnimate = useTransition(true, {
        config: {duration: 50},
        from: { y: 5, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 5, opacity: 0 },
    })

    return (
        firstAnimate((style, item) => item ? <animated.a target="_blank" href={playlistLink} style={style} className="playlist-card" >
            <img className="playlist-img" src={playlistImgSrc} alt="" />
            <div className="playlist-info">
                <h1 className="playlist-title">{playlistName}</h1>
                <h1 className="playlist-tracks">{numOfTracks} songs</h1>
            </div>
        </animated.a> : null)
        
    )
}

export default Playlist
