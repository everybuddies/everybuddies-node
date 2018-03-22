var clientId = ENV.google.clientId;
var clientSecret = ENV.google.clientSecret
var scope = 'https://www.googleapis.com/auth/userinfo.email';
var redirectUri = ENV.google.redirectUri;// 'http://localhost:8001/oauth2callback';


// var GoogleAuth; // Google Auth object.

var api = {
    /*  * Request access token from Google's OAuth 2.0 server.
   */
    authenticate: () => {//state
        var urlObj = new URL('o/oauth2/v2/auth', 'https://accounts.google.com');
        urlObj.searchParams.append('client_id', clientId);
        urlObj.searchParams.append('redirect_uri', redirectUri);//'');
        urlObj.searchParams.append('response_type', 'code');
        urlObj.searchParams.append('scope', scope);
        // urlObj.searchParams.append('state', state);
        urlObj.searchParams.append('prompt', 'consent');
        urlObj.searchParams.append('access_type', 'offline');
        window.location.assign(urlObj);
    },



    /*  * Request access token from Google's OAuth 2.0 server.
    */
    // requestToken: (code) => {
    //     // Google's OAuth 2.0 endpoint for requesting an access token
    //     var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    //     return new Promise((resolve, reject) => {
    //         //var url = new URL('oauth2/v4/token', 'https://www.googleapis.com');
    //         // Parameters to pass to OAuth 2.0 endpoint.
    //         var params = {
    //             'client_id': clientId,
    //             'redirect_uri': redirectUri,
    //             'scope': scope,
    //             'include_granted_scopes': 'true',
    //             'response_type': 'token'
    //         };
    //         var headers = new Headers();
    //         headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //         var body = JSON.stringify(params);
    //         var init = {
    //             method: 'POST',
    //             headers: headers,
    //             mode: 'cors',
    //             body: body

    //         };
    //         var request = new Request(oauth2Endpoint, init);
    //         fetch(request).then((res) => {
    //             res.json().then((accessToken) => {
    //                 resolve(accessToken);
    //             })
    //         }, (err) => {
    //             reject(err);
    //             console.log(err);
    //         });
    //     });
    // },
    // validateUserToken: (tokenId) => {
    //     return new Promise((resolve, reject) => {
    //         fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + tokenId).then((response) => {
    //             // return reject();
    //             if (response.status === 200) {
    //                 response.json().then((tokenInfo) => {
    //                     resolve(tokenInfo);
    //                 });
    //             } else if (response.status === 400) {
    //                 response.json().then((err) => {
    //                     reject(err);
    //                 });
    //             }
    //         });
    //     })
    // },
    refreshAccessToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            var url = new URL('oauth2/v4/token', 'https://www.googleapis.com');
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            var init = {
                method: 'POST',
                headers: headers,
                body: 'client_id=' + clientId + '&' +
                'client_secret=' + clientSecret + '&' +
                'refresh_token=' + refreshToken + '&' +
                'grant_type=refresh_token'
            }
            var request = new Request(url, init);
            fetch(request).then((response) => {
                if (response.status === 200) {
                    response.json().then((accessToken) => {
                        resolve(accessToken);
                    });
                } else if (response.status === 400) {
                    response.json().then((err) => {
                        reject(err);
                    });
                }
            });
        });
    },
    revokeAccess: (accessToken) => {
        return new Promise((resolve, reject) => {
            var url = new URL('oauth2/v4/token', 'https://www.googleapis.com');
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            var init = {
                method: 'POST',
                headers: headers,
                body: 'token=' + accessToken
            }
            var request = new Request(url, init);
            fetch(request).then((response) => {
                if (response.status === 200) {
                    response.json().then((tokenInfo) => {
                        resolve(tokenInfo);
                    });
                } else if (response.status === 400) {
                    response.json().then((err) => {
                        reject(err);
                    });
                }
            });
        });
    }
};
//api.init();
export default api;