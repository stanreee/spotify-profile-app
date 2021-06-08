const token = localStorage.getItem("access-token");
const refreshToken = localStorage.getItem("refresh-token");

const api_url = "http://localhost:4000"

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

function buildURL(path) {
  return api_url + path + "?access_token=" + localStorage.getItem("access-token") + "&refresh_token=" + localStorage.getItem("refresh_token") + "&expired=" + isTokenExpired();
}

function isTokenExpired() {
  console.log(Date.now());
  console.log("stored timestamp: " + localStorage.getItem("timestamp"));
  return Date.now() - localStorage.getItem("timestamp") > 360000;
}

function handleData(data) {
  if(isTokenExpired()) {
    localStorage.setItem("access-token", data.refreshed_token);
  }
  return data;
}

export const retrieveBasicUserData = async () => {
  const expired = isTokenExpired();

  const url = api_url + "/api/user-info?access_token=" + localStorage.getItem("access-token") + "&refresh_token=" + localStorage.getItem("refresh-token") + "&expired=" + expired;

  console.log(url);

  await fetch(url)
  .then(response => {
    response.json().then(data => {
      console.log(data);
      const handledData = handleData(data);
      return handledData;
    })
  }).catch(error => {
    console.log(error);
    handleErrors(error);
  })
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