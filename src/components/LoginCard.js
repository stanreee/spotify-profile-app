const redirect = process.env.NODE_ENV === "production" ? "https://spotify-personalized.herokuapp.com/login" : "http://localhost:4000/login"

function LoginCard() {
    return (
        <div className="login-card">
            <h1>Login with Spotify</h1>
            <a href={redirect} className="login-btn">
                LOG IN
            </a>
        </div>
    )
}

export default LoginCard
