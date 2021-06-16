import Playlist from './Playlist'
import { useEffect, useState } from 'react';
import spotify from '../spotify-grey.png';

function breakPlaylistData(playlistData) {
    return {
        id: playlistData.id,
        playlistImg: playlistData.images.length > 0 ? playlistData.images[0].url : spotify,
        name: playlistData.name,
        link: playlistData.external_urls.spotify,
        totalTracks: playlistData.tracks.total
    }
}

function Playlists({ playlistData }) {

    const [elements, setElements] = useState([]);
    const [visible, setVisible] = useState([]);
    const [page, setPage] = useState(1);

    const [maxPage, setMaxPage] = useState(null);

    var elementsArray = [];
    var visibleArray = [];

    useEffect(() => {
        if(playlistData) {
            setMaxPage(Math.ceil(playlistData.items.length / 8));
            var count = 0;
            playlistData.items.forEach((playlist) => {
                const playlistInfo = breakPlaylistData(playlist);
                elementsArray.push(<Playlist numOfTracks={playlistInfo.totalTracks} lastPlaylist={count===playlistData.items.length-1 && true} firstPlaylist={count===0 && true} key={playlistInfo.id} playlistImgSrc={playlistInfo.playlistImg} playlistName={playlistInfo.name} playlistLink={playlistInfo.link}></Playlist>);
                if(count < 8) {
                    visibleArray.push(elementsArray[count]);
                }
                count += 1;
            })
        }
        setVisible(visibleArray);
        setElements(elementsArray);
    }, [playlistData])

    const showMore = () => {
        setPage(page + 1);
        for(let i = page * 8; i < (page * 8 + 8); i++) {
            if(elements[i] === undefined) {
                break;
            }
            visibleArray.push(elements[i]);
        }
        console.log("page:", page);
        console.log("maxpage:", maxPage);
        setVisible([...visible, visibleArray]);
    }

    const showLess = () => {
        setPage(1);
        console.log("elements", elements, page);
        for(let i = 0; i < 8; i++) {
            if(elements[i] === undefined) {
                break;
            }
            console.log("test", elements[i]);
            visibleArray.push(elements[i]);
        }
        setVisible([visibleArray]);
    }

    return (
        <div className="playlists-div">
            <div className="outer-playlists">
                {visible}
            </div>
            {page !== maxPage ? 
            <button className="show-more-playlists" onClick={showMore}>Show More</button> 
            : 
            maxPage !== 1 && <button className="show-more-playlists" onClick={showLess}>Show Less</button>}
        </div>
    )
}

export default Playlists
