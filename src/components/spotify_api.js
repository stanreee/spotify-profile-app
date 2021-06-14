const token = localStorage.getItem("access-token");
const refreshToken = localStorage.getItem("refresh-token");

const api_url = "http://localhost:4000"

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

function buildURL(path, firstParam) {
  const firstChar = firstParam ? "&" : "?"
  return api_url + path + firstChar + "access_token=" + localStorage.getItem("access-token") + "&refresh_token=" + localStorage.getItem("refresh-token") + "&expired=" + isTokenExpired();
}

function isTokenExpired() {
  return Date.now() - localStorage.getItem("timestamp") > 360000;
}

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

  console.log(localStorage.getItem("access-token"));

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
  console.log(url);

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
  }
}