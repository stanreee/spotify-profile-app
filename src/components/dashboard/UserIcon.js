import icon from './spotify-512.png';

function UserIcon({ iconLink, customClass, redirect }) {
    return (
        <a target="_blank" href={redirect} className={customClass}>
            <img src={iconLink} alt="" />
        </a>
    )
}

export default UserIcon
