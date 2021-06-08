import logo from './spotify-512.png';

const test = () =>  {
    console.log(process.env.redirect_uri);
}

function LoginCard() {
    return (
        <div className="login-card">
            <h1>Login with Spotify</h1>
            <a href="http://localhost:4000/login" className="login-btn">
                LOG IN
            </a>
        </div>
    )
}

export default LoginCard
