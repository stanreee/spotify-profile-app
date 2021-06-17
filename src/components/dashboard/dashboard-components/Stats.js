import { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import { getRecentlyPlayed, getTop } from '../../spotify_api'
import UserIcon from '../UserIcon'
import Loading from '../../Loading'
import playbtn from '../play-btn.png'
import spotify from '../spotify-grey.png'

function breakArtistData(artist) {
    return {
        name: artist.name,
        imgUrl: artist.images.length > 0 ? artist.images[0].url : spotify,
        id: artist.id,
        url: artist.external_urls.spotify
    }
}

function Stats() {
    const [stat, setStat] = useState('Retrospect');
    const [childComponent, setChildComponent] = useState(<GeneralStatistics></GeneralStatistics>);

    return (
        <div className="stats-div">
            <OptionBar stat={stat} setStat={setStat} setChildComponent={setChildComponent}></OptionBar>
            {childComponent}
        </div>
    )
}

function OptionBar({setChildComponent, setStat, stat}) {

    function changeStatSetting(statName, childComponent) {
        setStat(statName);
        setChildComponent(childComponent);
    }

    function OptionItem({ currentStat, statName, setChildComponent, childComponent }, props) {
        return (
            <div style={currentStat === statName ? {borderBottom: "2px solid #1DB954"} : {borderBottom: "none"}} className="user-stats-optionbar-item" onClick={() => changeStatSetting(statName, childComponent)}>
                <h1>{statName}</h1>
            </div>
        );
    }

    return <div className="user-stats-optionbar"> 
        <OptionItem currentStat={stat} statName="Retrospect" childComponent={<GeneralStatistics></GeneralStatistics>}></OptionItem>
        <OptionItem currentStat={stat} statName="Your Recently Played" childComponent={<RecentlyPlayed></RecentlyPlayed>}></OptionItem>
        <OptionItem currentStat={stat} statName="Your Top Artists" childComponent={<TopArtists></TopArtists>}></OptionItem>
    </div>
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

    const [hovered, setHovered] = useState(false);

    const transition = useTransition(hovered, {
        from: { y: 20, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 20, opacity: 0 },
    });

    const firstAnimated = useTransition(true, {
        config: {duration: 100}, 
        from: { y: 20, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 20, opacity: 0 },
    })

    return firstAnimated((style, item) => item ? <animated.div style={style} className="track" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <img src={track.album.images[0].url} alt="" />
        {transition((style, item) => item ? <animated.div style={style} className="play-btn-div">
            <UserIcon pointer="default" redirect={track.external_urls.spotify} iconLink={playbtn} customClass="user-icon play-btn" hoverBrightness="115%"></UserIcon>
        </animated.div> : null)}
        <div className="track-info">
            <h1>{track.name}</h1>
            <h2>{getArtists(track.artists)} • <a target="_blank" href={track.album.external_urls.spotify}>{track.album.name}</a></h2>
        </div>
    </animated.div> : null)
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
                trackHTML.push(<TrackItem key={track.track.id} track={track.track}></TrackItem>)
            })

            setTrackItem(trackHTML);
        }

        getData();
    }, [])

    return (
        track ? <div className="user-stats-recently-played">
            {track && track}
        </div> : <Loading></Loading>
    );
}

function ArtistIcon({artistData}) {
    return <div className="artist-icon">
        <UserIcon redirect={artistData.url} iconLink={artistData.imgUrl} customClass="user-icon icon-artist top"></UserIcon>
        <h1>{artistData.name}</h1>
    </div>
}

function TopArtists() {

    const firstAnimate = useTransition(true, {
        from: { y: 20, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 20, opacity: 0 },
    })

    const [timeRange, setTimeRange] = useState("long_term");

    const [html, setHtml] = useState(null);

    const [animate, setAnimate] = useState(false);

    const transition = useTransition(animate, {
        config: {duration: 250},
        from: { y: 20, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 20, opacity: 0 },
    });

    useEffect(() => {
        async function getData() {
            const data = await getTop("artists", timeRange, 25);
            
            var artists = [];
            data.items.forEach((artist) => {
                const artistData = breakArtistData(artist);
                artists.push(<ArtistIcon artistData={artistData}></ArtistIcon>)
            })
            setHtml(artists);
            setAnimate(true);
        }

        getData();
    }, [timeRange])

    return (
        html ? <div className="user-stats-top-artists">
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
            {transition((style, item) => item ? <animated.div style={style} className="top-artists">
                {html}
            </animated.div> : null)}
        </div> : <Loading></Loading>
    );
}

function GeneralStatistics() {

    const [artistData, setArtistData] = useState(null);
    const [topTrack, setTopTrack] = useState(null);
    const [followUpTracks, setFollowUpTracks] = useState(null);
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

            var followUp = [];
            for(let i = 1; i < trackData.items.length; i++) {
                if(i >= 5) break;
                followUp.push({
                    key: trackData.items[i].id,
                    name: trackData.items[i].name,
                    artists: trackData.items[i].artists
                });
            }

            setFollowUpTracks(followUp);

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

    function styleText(hex, text, href) {
        return <a href={href}><span style={{color: hex}}>{text}</span></a>
    }

    function formatFollowedUpTracks() {
        var text = [];

        var count = 0;
        followUpTracks.forEach((track) => {
            //text.push([styleText("#4fd87f", track.name), <h2> by </h2>, styleText("#4fd87f", getArtists(track.artists)), <h2>, </h2>])

            const last = count == followUpTracks.length - 1;

            text.push([
                last && "and ",
                styleText("#43ad68", track.name),
                " by ",
                styleText("#43ad68", getArtists(track.artists)),
                last ? "." : ", "
            ])
            count++;
        })

        return text;
    }

    function getTrackText() {
        switch(timeRangeBuffer) {
            case "short_term":
                return [<h1>
                    {"This month, you couldn't get enough of "}
                    {styleText("#4fd87f", topTrack[0])}
                    {" by "}
                    {styleText("#4fd87f", getArtists(topTrack[1]) + ".")}
                    </h1>, <h2 className="follow-ups">
                    {"Followed by "}
                    {formatFollowedUpTracks()}
                </h2>]
            case "medium_term":
                return [<h1>
                    {styleText("#4fd87f", topTrack[0])}
                    {" by "}
                    {styleText("#4fd87f", getArtists(topTrack[1]))}
                    {" was your go to song these past couple of months."}
                </h1>, <h2 className="follow-ups">
                    {"Followed by "}
                    {formatFollowedUpTracks()}
                </h2>]
            case "long_term":
                return [<h1>
                    {"Your favourite song of all time is "}
                    {styleText("#4fd87f", topTrack[0])}
                    {" by "}
                    {styleText("#4fd87f", getArtists(topTrack[1]))}
                    {". Isn't that wonderful?"}
                </h1>, <h2 className="follow-ups">
                    {"Followed by "}
                    {formatFollowedUpTracks()}
                </h2>]
        }
    }

    return (
        artistData ? <div className="user-stats-general-statistics">
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
                    <UserIcon redirect={artistData && artistData.items[0].external_urls.spotify} iconLink={artistData && breakArtistData(artistData.items[0]).imgUrl} customClass="user-icon icon-artist"></UserIcon>
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
                    <h2>Your Top Tracks</h2>
                </animated.div> : null
            )}
        </div> : <Loading></Loading>
    );
}

export default Stats
