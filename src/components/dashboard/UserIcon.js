import icon from './spotify-512.png';

function UserIcon({ iconLink }) {
    return (
        <div className="user-icon">
            <img src={iconLink} alt="" />
        </div>
    )
}

export default UserIcon
