import React from 'react'
import Dashboard from './Dashboard';
import UserIcon from './UserIcon';
import { retrieveBasicUserData, retrieveFollowingData } from '../spotify_api'
import { useState, useEffect } from 'react';

function Body() {
    
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        async function retrieveData() {
            const data = await retrieveBasicUserData();
            setUserData(data);
            console.log("retrieved user data:", data)
        }
        retrieveData();
    }, []);

    return (
        <div className="main-body">
            <UserIcon iconLink={userData && userData.images[0].url} />
            <div className="user-info-div">
                <div className="user-info">
                    <h1>{userData && userData.display_name}</h1>
                    <h2>{userData && `${userData.followers.total} followers • following`}</h2>
                    <h2># of playlists</h2>
                </div>
            </div>
            <Dashboard />
        </div>
    )
}

export default Body
