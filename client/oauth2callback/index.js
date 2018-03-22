var clientId = ENV.google.clientId;
var clientSecret = ENV.google.clientSecret;
var redirectUri = ENV.google.redirectUri;
var search = location.search.substring(1);
var code = search.split('=')[1];

var http = new XMLHttpRequest();
var url = "https://www.googleapis.com/oauth2/v4/token";
var params = 'code=' + code + '&' +
    'client_id=' + clientId + '&' +
    'client_secret=' + clientSecret + '&' +
    'redirect_uri=' + redirectUri + '&' +
    'grant_type=authorization_code';
http.open("POST", url, true);

http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

http.onreadystatechange = function () { //Call a function when the state changes.
    if (http.readyState == 4) {
        if (http.status == 200) {
            var accessToken = JSON.parse(http.responseText);
            localStorage.setItem('access_token', accessToken.access_token);
            localStorage.setItem('id_token', accessToken.id_token);
            localStorage.setItem('refresh_token', accessToken.refresh_token);
            window.location.assign(localStorage.getItem('last_location') || '/');
        } else {
            document.body.innerHTML = http.responseText;
        }

    }
}
http.send(params);
