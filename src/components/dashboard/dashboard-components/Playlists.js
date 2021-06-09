import Playlist from './Playlist'
import { useEffect, useState } from 'react';

function Playlists({ playlistData }) {

    const [elements, setElements] = useState([]);

    var elementsArray = [];

    useEffect(() => {
        if(playlistData) {
            var count = 0;
            playlistData.items.forEach((playlist) => {
                elementsArray.push(<Playlist numOfTracks={playlist.tracks.total} lastPlaylist={count==playlistData.items.length-1 && true} firstPlaylist={count == 0 && true} key={playlist.id} playlistImgSrc={playlist.images[0].url} playlistName={playlist.name} playlistLink={playlist.external_urls.spotify}></Playlist>);
                count += 1;
            })
        }
        setElements(elementsArray);
    }, [playlistData])

    if(playlistData) {
        console.log("hello", elements);
        console.log(playlistData.items);
    }

    return (
        <div className="playlists-div">
            {elements}
        </div>
    )
}

export default Playlists
