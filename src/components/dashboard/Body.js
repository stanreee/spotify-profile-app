import React from 'react'
import Dashboard from './Dashboard';
import UserIcon from './UserIcon';
import { retrieveBasicUserData, retrievePlaylistData } from '../spotify_api'
import { useState, useEffect } from 'react';

function Body() {
    
    const [userData, setUserData] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);

    useEffect(() => {
        async function retrieveData() {
            const data = await retrieveBasicUserData();
            const playlists = await retrievePlaylistData();
            setPlaylistData(playlists);
            setUserData(data);
            console.log("retrieved user data:", data)
            console.log("retrieved playlist data:", playlists);
        }

        retrieveData();
    }, []);

    return (
        <div className="main-body">
            <UserIcon iconLink={userData && userData.images[0].url} />
            <div className="user-info-div">
                <div className="user-info">
                    <h1>{userData && userData.display_name}</h1>
                    <h2>{userData && `${userData.followers.total} followers`}</h2>
                    <h2>{playlistData && `${playlistData.total} public playlists`}</h2>
                </div>
            </div>
            <Dashboard playlistData={playlistData && playlistData}/>
        </div>
    )
}

export default Body
