const { readFile } = require('fs');

const express = require('express');

const app = express();

const path = require('path');

const https = require('https');

const axios = require('axios');

const url = require('url');

const { isBuffer } = require('util');
const { query } = require('express');

let headers = {};

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.get('/login', (req, res) => {
    const SCOPE = 'user-read-private user-read-email';
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

const api_url = "https://api.spotify.com"

app.get('/api/user-info', async (req, res) => {
    const queryObject = url.parse(req.url, true).query;

    var accessToken = queryObject.access_token;

    console.log("old access token: " + accessToken);

    if(queryObject.expired === 'true') {
        console.log(queryObject.refresh_token);
        // for some reason \/ this is assigning accessToken to be undefined, even though it's actually returning something
        accessToken = await refreshAccessToken(queryObject.refresh_token);
    }

    console.log("new access token: " + accessToken);

    axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const data = response.data;
        const responseData = {
            data, 
            "refreshed_token": accessToken
        };
        console.log(responseData);
        res.send(responseData);
    }).catch((error) => {
        res.send("error");
        console.log(error.response.status);
    })
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
        console.log(error.response.status);
    })
    return accessTokenRefreshed;
}

function isTokenExpired() {
    return (Date.now() - process.env.timestamp) > 3600000;
}

function handleCodeAuthorization(req, res) {
    axios({
        method: 'post',
        url: `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env.redirect_uri}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${new Buffer.from(`${process.env.client_id}:${process.env.client_secret}`).toString('base64')}`
        }
    }).then((response) => {
        console.log(`statusCode: ${response.statusCode}`);
        
        // const data = response.data;
        // const access_token = data.access_token;
        // const refresh_token = data.refresh_token;
        // process.env.accessToken = access_token;
        // process.env.refreshToken = refresh_token;

        // process.env.timestamp = Date.timestamp;

        // headers = {
        //     'Authorization': `Bearer ${process.env.accessToken}`,
        //     'Content-Type': 'application/json'
        // }

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

app.listen(process.env.PORT || 4000, () => console.log(`App available on http://localhost:4000`));