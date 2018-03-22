import Promise from 'es6-promise';      //polyfill promise to work with old explorer
import 'whatwg-fetch';                  //polyfill es6 fetch to work with old explorer and new safari
// import ReactDOM from 'react-dom';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import { parseSearchQuery } from 'controls/modules.jsx';
import sessionService from 'services/session';

import createBrowserHistory from 'history/createBrowserHistory';

import dondeTaggerAPI from 'services/dondetagger.js';
import Shell from "./shell";

const browserHistory = createBrowserHistory();

const ShellRouter = (props) => {

    if (sessionService.isUserConsented()) {
        var query = parseSearchQuery(props.location.search);
        var jobId = Array.isArray(query.job) ? query.job[0] : query.job;
        var userId = Array.isArray(query.user) ? query.user[0] : query.user;
        var userToken = Array.isArray(query.token) ? query.token[0] : query.token;
        var mode = Array.isArray(query.mode) ? query.mode[0] : query.mode;

        dondeTaggerAPI.init(jobId, userId, userToken, mode);
        return (
            <Shell id="shell"></Shell>
        )
    } else {
        sessionService.authenticate(props.location.search);
        return <div id="shell">Please Wait</div>
    }

}

Promise.polyfill();

import './themes/font/theme.default.font.js';
import './index.scss';

render(
    <Router history={browserHistory}>
        <Route path="/" component={ShellRouter}></Route>
    </Router>, document.getElementById('root'));