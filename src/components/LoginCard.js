import UserIcon from './dashboard/UserIcon'
import icon from './dashboard/GitHub-Mark.png'

const redirect = process.env.NODE_ENV === "production" ? "https://personalized-spotify.herokuapp.com/login" : "http://localhost:4000/login"

function LoginCard() {
    return (
        <div className="login-card">
            <h1>Login with Spotify</h1>
            <a href={redirect} className="login-btn">
                LOG IN
            </a>
            <UserIcon redirect="https://github.com/stanreee/spotify-profile-app" customClass="user-icon github-icon" iconLink={icon}></UserIcon>
        </div>
    )
}

export default LoginCard
