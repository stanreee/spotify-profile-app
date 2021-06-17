const express = require('express');

const app = express();

const path = require('path');

const axios = require('axios');

const url = require('url');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

if (process.env.NODE_ENV === 'production') {
    console.log("production");
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

function handleResponseData(response, accessToken) {
    const data = response.data;
    const responseData = {
        data,
        "refreshed_token": accessToken
    };
    return responseData;
}

async function getToken(req) {
    const queryObject = url.parse(req.url, true).query;

    var accessToken = queryObject.access_token;

    if(queryObject.expired === 'true') {
        console.log(queryObject.refresh_token);
        accessToken = await refreshAccessToken(queryObject.refresh_token);
    }
    return accessToken;
}

app.get("/callback", (req, res) => {
    if(req.query.code) {
        handleCodeAuthorization(req, res);
        return;
    }
    res.send("no code given");
    res.redirect(`${process.env.frontend_uri}`);
})

async function refreshAccessToken(refreshToken) {
    console.log("given refresh token: " + refreshToken);
    var accessTokenRefreshed = null;
    await axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=" + refreshToken + "&client_id=" + process.env.client_id,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${new Buffer.from(`${process.env.client_id}:${process.env.client_secret}`).toString('base64')}`
        },
    }).then(response => {
        accessTokenRefreshed = response.data.access_token;
        console.log("refreshed access token. receieved data: " + accessTokenRefreshed);
        return accessTokenRefreshed;
    }).catch(error => {
        console.log("Error refreshing access token, " + error.response.status);
        console.log(error.response);
    })
    return accessTokenRefreshed;
}

function handleCodeAuthorization(req, res) {
    console.log("handling code");
    axios({
        method: 'post',
        url: `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env.redirect_uri}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${new Buffer.from(`${process.env.client_id}:${process.env.client_secret}`).toString('base64')}`
        }
    }).then((response) => {
        console.log(`statusCode: ${response.statusCode}`);

        const data = response.data;

        const accessTokenEncoded = encodeURIComponent(data.access_token);
        const refreshTokenEncoded = encodeURIComponent(data.refresh_token);
        const timestamp = Date.timestamp;

        const params = `?access_token=${accessTokenEncoded}&refresh_token=${refreshTokenEncoded}&timestamp=${timestamp}`;

        res.redirect(`${process.env.frontend_uri}${params}`);
        return;
    }).catch((error) => {
        res.send(`error`);
        console.log(error);
    })
}

app.get('/login', (req, res) => {
    const SCOPE = 'user-read-private user-read-email user-top-read user-read-recently-played';
    res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.client_id +
    '&scope=' + encodeURIComponent(SCOPE) + 
    '&redirect_uri=' + encodeURIComponent(process.env.redirect_uri))
});

app.get('/', (req, res) => {
    if(req.query.code) {
        handleCodeAuthorization(req, res);
        return;
    }
});

app.get('/api/user-playlists', async (req, res) => {
    const accessToken = await getToken(req);

    axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/playlists",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const responseData = handleResponseData(response, accessToken);
        res.send(responseData);
    }).catch((error) => {
        res.send("error");
        console.log(error.response.status);
    })
})

app.get('/api/user-info', async (req, res) => {
    const accessToken = await getToken(req);

    axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const responseData = handleResponseData(response, accessToken);
        res.send(responseData);
    }).catch((error) => {
        res.send("error");
        console.log(error.response.status);
    })
})

app.get('/api/user-playlist', async (req, res) => {
    const queryObject = url.parse(req.url, true).query;

    const playlistId = queryObject.playlist_id;

    const accessToken = await getToken(req);

    axios({
        method: "GET",
        url: "https://api.spotify.com/v1/playlists/" + playlistId,
        headers:{
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const responseData = handleResponseData(response, accessToken);
        res.send(responseData);
    }).catch((error) => {
        res.send("error");
        console.log(error.response.status);
    })
})

app.get('/api/user-top-artists', async (req, res) => {
    const queryObject = url.parse(req.url, true).query;

    const timeRange = queryObject.time_range;
    const limit = queryObject.limit;

    const accessToken = await getToken(req);

    axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/top/artists?time_range=" + timeRange + "&limit=" + limit,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const responseData = handleResponseData(response, accessToken);
        res.send(responseData);
    }).catch((error) => {
        res.send("error");
        console.log(error.response.status);
        console.log(error.response);
    })
})

app.get('/api/user-top-tracks', async (req, res) => {
    const queryObject = url.parse(req.url, true).query;

    const timeRange = queryObject.time_range;
    const limit = queryObject.limit;

    const accessToken = await getToken(req);

    axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=" + timeRange + "&limit=" + limit,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const responseData = handleResponseData(response, accessToken);
        res.send(responseData);
    }).catch((error) => {
        res.send("error");
        console.log(error.response.status);
        console.log(error.response);
    })
})

app.get('/api/user-recently-played', async (req, res) => {
    const accessToken = await getToken(req);

    axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const responseData = handleResponseData(response, accessToken);
        res.send(responseData);
    }).catch((error) => {
        res.send("error");
        console.log(error.response.status);
        console.log(error.response);
    })
})

app.listen(process.env.PORT || 4000, () => console.log(`App available on http://localhost:4000`));