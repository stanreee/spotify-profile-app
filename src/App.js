import Login from './components/Login'
import MainPage from './components/dashboard/MainPage'
import Loading from './components/Loading'

import { useEffect, useState } from 'react';
import { retrieveBasicUserData, retrievePlaylistData } from './components/spotify_api'

function App() {

  let search = window.location.search;
  let params = new URLSearchParams(search);

  var token = params.get('access_token');
  var refresh_token = params.get('refresh_token');

  if(token && !localStorage.getItem("access-token")) {
    localStorage.setItem("access-token", token);
    localStorage.setItem("refresh-token", refresh_token);
    localStorage.setItem("timestamp", Date.now());
  }else{
    token = localStorage.getItem("access-token");
    refresh_token = localStorage.getItem("refresh-token");
  }
  
  const [userData, setUserData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);

    useEffect(() => {
        async function retrieveData() {
            const data = await retrieveBasicUserData();
            const playlists = await retrievePlaylistData();
            setPlaylistData(playlists);
            setUserData(data);
            console.log("retrieved user data:", data)
            console.log("retrieved playlist data:", playlists);
        }

        if(token) {
          retrieveData();
        }
    }, []);

  return (
    token !== null ? ((userData && playlistData) ? 
    <MainPage userData={userData} playlistData={playlistData} /> : 
    <Loading />) : <Login />
  );
}

export default App;
