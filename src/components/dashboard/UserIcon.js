import { useState } from 'react';

function UserIcon({ pointer, iconLink, customClass, redirect, hoverBrightness }) {
    const [hovered, setHovered] = useState(false);
    const brightness = hoverBrightness ? hoverBrightness : "50%";
    const usePointer = pointer ? pointer : true;
    return (
        <a target="_blank" href={redirect} className={customClass} onMouseEnter={() => {setHovered(true);}} onMouseLeave={() => setHovered(false)}>
            <img src={iconLink} alt=""  style={{filter: hovered && "brightness(" + brightness + ")", cursor: usePointer}} />
        </a>
    )
}

export default UserIcon
