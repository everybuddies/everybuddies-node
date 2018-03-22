const defaultServer = ENV.api.url; //"http://localhost:8002/v1/analyst"
const defaultApiKey = ENV.api.key;
import authGoogle from 'services/oauth2google.js';
//import { EventTarget } from 'services/events.js';
import jwt from 'jwt-client';
console.log(defaultServer);
const NUMBER_OF_RETRIES = 2;

class JerrySession {

    constructor() {
        //super();
    }
    isUserConsented() {
        var refreshToken = localStorage.getItem('refresh_token');
        return (refreshToken);
    }

    storeAccessToken(accessToken) {
        localStorage.setItem('access_token', accessToken.access_token);
        localStorage.setItem('id_token', accessToken.id_token);
    }

    validate() {
        return new Promise((resolve) => {
            var tokenId = localStorage.getItem('id_token');
            var validToken = jwt.validate(tokenId);
            if (validToken) {
                return resolve();
            }
            var refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                authGoogle.refreshAccessToken(refreshToken).then((accessToken) => {
                    this.storeAccessToken(accessToken);
                    resolve(accessToken);
                })
            } else {
                this.authenticate()

                // reject()
            }
        });
    }

    requestToken(code) {
        return new Promise((resolve) => {//resolve, reject
            authGoogle.requestToken(code).then((accessToken) => {
                this.storeAccessToken(accessToken);
                localStorage.setItem('refresh_token', accessToken.refresh_token);
                resolve(accessToken);
            })
        });
    }

    fetch({ url, method = 'GET', query = null, body = null, server = defaultServer, key = defaultApiKey }) {
        return new Promise((resolve, reject) => {
            this.validate().then(() => {
                var init = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('id_token')
                    },
                    body: (body) ? JSON.stringify(body) : null
                }
                var urlObj = new URL(server + '/' + url, location.href);
                urlObj.searchParams.append('key', key);

                if (query) {
                    for (var param in query) {
                        var params = query[param];
                        if (params.forEach) {
                            params.forEach((value) => {
                                urlObj.searchParams.append(param, value);
                            })
                        } else {
                            urlObj.searchParams.append(param, params);
                        }
                    }
                }
                var retries = NUMBER_OF_RETRIES;

                var fetchRetry = () => {
                    fetch(urlObj, init).then((response) => {
                        if (response.status === 200)
                            response.json().then((response) => {
                                resolve(response);
                            });
                        else if (response.status === 401) {
                            console.log(response);
                            response.json().then((response) => {
                                reject(response);
                            });
                            // reject();
                        } else {
                            if (retries--) {
                                fetchRetry();
                            } else {
                                response.json().then((response) => {
                                    console.log(response);
                                    return reject(response);
                                });
                            }

                        }
                    })
                }

                fetchRetry();

            });
        })
    }

    authenticate(state) {
        var currentLocation = window.location.href.replace(window.location.host, '').replace(window.location.protocol + '//', '');
        localStorage.setItem('last_location', currentLocation);
        authGoogle.authenticate(state);
    }
}
let jerrySession = new JerrySession();
export default jerrySession;