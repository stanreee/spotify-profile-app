import { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import { getRecentlyPlayed, getTop } from '../../spotify_api'
import UserIcon from '../UserIcon'

function Stats() {
    const [stat, setStat] = useState('Retrospect');
    const [childComponent, setChildComponent] = useState(<GeneralStatistics></GeneralStatistics>);

    return (
        <div className="stats-div">
            <Dropdown stat={stat} setStat={setStat} setChildComponent={setChildComponent}></Dropdown>
            {childComponent}
        </div>
    )
}

function getArtists(artists) {
    var artistText = artists[0].name;
    for(var i = 1;  i < artists.length; i++) {
        if(i == artists.length - 1) {
            if(artists.length > 2) {
                artistText += ", and " + artists[i].name;
            }else {
                artistText += " and " + artists[i].name;
            }
        }else{
            artistText += ", " + artists[i].name;
        }
    }
    return artistText;
}

function TrackItem({track}) {
    return <div className="track">
        <img src={track.album.images[0].url} alt="" />
        <div className="track-info">
            <h1>{track.name}</h1>
            <h2>{getArtists(track.artists)} • {track.album.name}</h2>
        </div>
    </div>
}

function RecentlyPlayed() {

    //const [tracks, setTracks] = useState(null);
    const [track, setTrackItem] = useState(null);

    const transition = useTransition(track, {
        from: { y: 20, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 20, opacity: 0 },
    });

    useEffect(() => {
        async function getData() {
            const data = await getRecentlyPlayed();

            const tracks = data.items;
            console.log(tracks);

            const trackHTML = [];

            tracks.forEach((track) => {
                trackHTML.push(<TrackItem track={track.track}></TrackItem>)
            })

            setTrackItem(trackHTML);
        }

        getData();
    }, [])

    return (
        <div className="user-stats-recently-played">
            {track && track}
        </div>
    );
}

function TopArtists() {
    return (
        <div className="user-stats-top-artists">
        </div>
    );
}

function GeneralStatistics() {

    const [artistData, setArtistData] = useState(null);
    const [topTrack, setTopTrack] = useState(null);
    const [topGenre, setTopGenre] = useState(null);

    const [timeRange, setTimeRange] = useState("long_term");
    const [timeRangeBuffer, setTimeRangeBuffer] = useState("long_term");

    const [animate, setAnimate] = useState(false);

    const transition = useTransition(animate, {
        from: { y: 20, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 20, opacity: 0 },
    });

    const firstAnimate = useTransition(true, {
        from: { y: 20, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 20, opacity: 0 },
    })

    useEffect(() => {
        async function getData() {
            const data = await getTop("artists", timeRange, 25);
            const trackData = await getTop("tracks", timeRange, 25);

            const artists = data.items;

            var map = {};
            var maxCount = 1;
            var maxElement = artists[0].genres[0];
            artists.forEach((artist) => {
                artist.genres.forEach((genre) => {
                    if(map[genre] == null) {
                        map[genre] = 1;
                    }else{
                        map[genre] += 1;
                    }
                    if(map[genre] > maxCount) {
                        maxCount = map[genre];
                        maxElement = genre;
                    }
                })
            })

            const words = maxElement.split(' ');
            var genreUpperCase = '';
            words.forEach((word) => {
                word = word[0].toUpperCase() + word.substring(1, word.length);
                genreUpperCase += word + " ";
            })

            setTopTrack([trackData.items[0].name, trackData.items[0].artists]);
            setTopGenre(genreUpperCase.substring(0, genreUpperCase.length - 1));
            setArtistData(data);
            setAnimate(true);
            setTimeRangeBuffer(timeRange);
        }

        getData();
    }, [timeRange])

    function getGenreText() {
        switch(timeRangeBuffer){
            case "short_term":
                return "Your Top Genre This Month";
            case "medium_term":
                return "Your Top Genre In The Last 6 Months"
            case "long_term":
                return "Your All Time Top Genre"
        }
    }

    function getArtistText() {
        switch(timeRangeBuffer) {
            case "short_term":
                return "Your Top Artist This Month"
            case "medium_term":
                return "Your Top Artist In The Last 6 Months"
            case "long_term":
                return "Your All Time Top Artist"
        }
    }

    function styleText(hex, text) {
        return <span style={{color: hex}}>{text}</span>
    }

    function getTrackText() {
        switch(timeRangeBuffer) {
            case "short_term":
                return <h1>
                    {"This past month, you couldn't get enough of "}
                    {styleText("#4fd87f", topTrack[0])}
                    {" by "}
                    {styleText("#4fd87f", getArtists(topTrack[1]) + ".")}
                    </h1>
            case "medium_term":
                return <h1>
                    {styleText("#4fd87f", topTrack[0])}
                    {" by "}
                    {styleText("#4fd87f", getArtists(topTrack[1]))}
                    {" was your go to song these past couple of months."}
                </h1>
            case "long_term":
                return <h1>
                    {"Your favourite song of all time is "}
                    {styleText("#4fd87f", topTrack[0])}
                    {" by "}
                    {styleText("#4fd87f", getArtists(topTrack[1]))}
                    {". Isn't that wonderful?"}
                </h1>
        }
    }

    return (
        <div className="user-stats-general-statistics">
            {firstAnimate((style, item) =>
                item ? <animated.div style={style} className="general-statistics-time">
                    <h1 onClick={() => {
                        setTimeRange("long_term")
                        setAnimate(false);
                    }} style={timeRange === "long_term" ? {color: "#1DB954"} : {color: "white"}}>All Time</h1>
                    <h1 onClick={() => {
                        setTimeRange("medium_term")
                        setAnimate(false);
                    }} style={timeRange === "medium_term" ? {color: "#1DB954"} : {color: "white"}}>6m</h1>
                    <h1 onClick={() => {
                        setTimeRange("short_term")
                        setAnimate(false);
                    }} style={timeRange === "short_term" ? {color: "#1DB954"} : {color: "white"}}>1m</h1>
                </animated.div> : null
            )}
            {transition((style, item) => 
                item ? <animated.div style={style} className="general-stat top-artist">
                    <UserIcon redirect={artistData && artistData.items[0].external_urls.spotify} iconLink={artistData && artistData.items[0].images[0].url} customClass="user-icon icon-artist"></UserIcon>
                    <h1>{artistData && artistData.items[0].name}</h1>
                    <h2>{getArtistText()}</h2>
                </animated.div> : null
            )}
            {transition((style, item) =>
                item ? <animated.div style={style} className="general-stat top-genre">
                    <h1>{topGenre && topGenre}</h1>
                    <h2>{getGenreText()}</h2>
                </animated.div>: null
            )}
            {transition((style, item) =>
                item ? <animated.div style={style} className="general-stat top-track">
                    <h1>{getTrackText()}</h1>
                    <h2>Your Top Track</h2>
                </animated.div> : null
            )}
        </div>
    );
}

function Dropdown({stat, setStat, setChildComponent}) {

    const [open, setOpen] = useState(false); 

    const transition = useTransition(open, {
        config: {mass: 1, tension: 200, friction: 18},
        from: { y: -10, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: -10, opacity: 0 },
    });

    return (
        <div className="user-stats-dropdown" onClick={() => setOpen(!open)}>
            {stat}
            {transition((style, item) => 
                item ? <DropdownMenu style={style} stat={stat} setStat={setStat} setChildComponent={setChildComponent}></DropdownMenu> : null
            )}
        </div>
    );
}

function DropdownMenu({style, stat, setStat, setChildComponent}) {

    function changeStatSetting(statName, childComponent) {
        setStat(statName);
        setChildComponent(childComponent);
    }

    function DropdownItem({ statName, setChildComponent, childComponent }, props) {
        return (
            <div className="user-stats-dropdown-item" onClick={() => changeStatSetting(statName, childComponent)}>
                <h1>{statName}</h1>
            </div>
        );
    }

    return (
        <animated.div style={style} className="user-stats-dropdown-menu">
            <div className="menu">
                {stat !== "Your Recently Played" && <DropdownItem statName="Your Recently Played" setChildComponent={setChildComponent} childComponent={<RecentlyPlayed></RecentlyPlayed>} ></DropdownItem>}
                {stat !== "Your Top Artists" && <DropdownItem statName="Your Top Artists" setChildComponent={setChildComponent} childComponent={<TopArtists></TopArtists>}></DropdownItem>}
                {stat !== "Retrospect" && <DropdownItem statName="Retrospect" setChildComponent={setChildComponent} childComponent={<GeneralStatistics></GeneralStatistics>}></DropdownItem>}
            </div>
        </animated.div>
    );
}

export default Stats
