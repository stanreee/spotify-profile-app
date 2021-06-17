import React from 'react'
import UserIcon from './UserIcon'
import icon from './GitHub-Mark.png'

function Footer() {

    function logout() {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("timestamp");
        window.history.pushState({}, document.title, "/");
        window.location.reload(false);
    }

    return (
        <div className="footer">
            <div className="logout">
                <div className="logout-btn" onClick={() => logout()}>
                    <h2>Logout</h2>
                </div>
            </div>
            <UserIcon redirect="https://github.com/stanreee/spotify-profile-app" customClass="user-icon github-icon" iconLink={icon}></UserIcon>
        </div>
    )
}

export default Footer
