const token = localStorage.getItem("access-token");
const refreshToken = localStorage.getItem("refresh-token");

const api_url = "http://localhost:4000"

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

function buildURL(path) {
  return api_url + path + "?access_token=" + localStorage.getItem("access-token") + "&refresh_token=" + localStorage.getItem("refresh-token") + "&expired=" + isTokenExpired();
}

function isTokenExpired() {
  console.log(Date.now());
  console.log("stored timestamp: " + localStorage.getItem("timestamp"));
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

  const url = buildURL("/api/user-info");

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

export const retrieveFollowingData = async () => {
  const url = api_url + "v1/me/following";
  await fetch(api_url, {
    method: 'GET',
    headers: headers
  })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    handleErrors(error);
  })
}

function handleErrors(error) {
  switch(error.status){
    case 401:
      console.log("Token timed out, use refresh token or log in again.");
  }
}