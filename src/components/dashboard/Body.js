import React from 'react'
import Dashboard from './Dashboard';
import UserIcon from './UserIcon';
import icon from './spotify-grey.png';

function Body({ userData, playlistData }) {

    return (
        <div className="main-body">
            <UserIcon hoverBrightness="50%" redirect={userData && userData.external_urls.spotify} iconLink={userData && (userData.images ? userData.images[0].url : icon)} customClass={"user-icon"} />
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
