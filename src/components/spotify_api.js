const api_url = process.env.NODE_ENV === "production" ? "https://personalized-spotify.herokuapp.com" : "http://localhost:4000"

/*
Build URL for frontend to request data from backend.
 */
function buildURL(path, firstParam) {
  const firstChar = firstParam ? "&" : "?"
  return api_url + path + firstChar + "access_token=" + localStorage.getItem("access-token") + "&refresh_token=" + localStorage.getItem("refresh-token") + "&expired=" + isTokenExpired();
}

/*
Checks if the token is expired given the timestamp stored in memory.
*/
function isTokenExpired() {
  return Date.now() - localStorage.getItem("timestamp") > 3600000;
}

/*
Handles the data received from the backend, refreshes the access token if the token has expired.
*/
function handleData(data) {
  var handledData = data.data;
  if(isTokenExpired()) {
    localStorage.setItem("access-token", data.refreshed_token);
    localStorage.setItem("timestamp", Date.now());
  }
  return handledData;
}

export const retrieveBasicUserData = async () => {
  const url = buildURL("/api/user-info", false);

  var handledData = null;

  const response = await fetch(url)
  .catch(error => {
    console.log(error);
    handleErrors(error);
  })

  const data = await response.json();
  handledData = handleData(data);

  return handledData;
}

export const getTop = async (type, timeRange, limit) => {
  const url = buildURL("/api/user-top-" + type + "?time_range=" + timeRange + "&limit=" + limit, true);

  var handledData = null;

  const response = await fetch(url)
  .catch(error => {
    console.log(error);
    handleErrors(error);
  })

  const data = await response.json();
  handledData = handleData(data);

  return handledData;
}

export const getRecentlyPlayed = async () => {
  const url = buildURL("/api/user-recently-played", false);

  var handledData = null;

  const response = await fetch(url)
  .catch(error => {
    console.log(error);
    handleErrors(error);
  })

  const data = await response.json();
  handledData = handleData(data);

  return handledData;
}

export const retrievePlaylistData = async () => {
  const url = buildURL("/api/user-playlists", false);

  var handledData = null;

  const response = await fetch(url)
  .catch(error => {
    console.log(error);
    handleErrors(error);
  })

  const data = await response.json();

  data.data.items.forEach(async (playlist) => {
    const playlistData = await getPlaylistData(playlist.id);
    playlist.images = playlistData;
  })

  handledData = handleData(data);

  return handledData;
}

async function getPlaylistData(playlistId) {

  const url = api_url + "/api/user-playlist?playlist_id=" + playlistId + "&access_token=" + localStorage.getItem("access-token") + "&refresh_token=" + localStorage.getItem("refresh-token") + "&expired=" + isTokenExpired();

  const response = await fetch(url)
  .catch(error => {
    console.log(error);
    handleErrors(error);
  })

  const data = await response.json();

  const handledData = handleData(data);

  return handledData.images;
}

function handleErrors(error) {
  switch(error.status){
    case 401:
      console.log("Token timed out, use refresh token or log in again.");
      break;
    case 503:
      console.log("Spotify web servers are down. Try again later.");
      break;
    default:
      console.log("Error: " + error.status);
  }
}
