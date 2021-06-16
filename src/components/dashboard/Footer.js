import React from 'react'
import UserIcon from './UserIcon'
import icon from './GitHub-Mark.png'

function Footer() {
    return (
        <div className="footer">
            <UserIcon redirect="https://github.com/stanreee/spotify-profile-app" customClass="user-icon github-icon" iconLink={icon}></UserIcon>
        </div>
    )
}

export default Footer
