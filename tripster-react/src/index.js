import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import Trips from './components/Trips';
import App from './components/App';
import Home from './components/Home';
import { Route, Switch, BrowserRouter} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/plan-trip" component={App} />
            <Route exact path="/trips" component={Trips} />
            <Route path="/" component={Home} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
