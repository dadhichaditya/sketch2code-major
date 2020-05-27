import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';
import Canvas from './Canvas';
import Webpage from './Webpage';
import socketIOClient from "socket.io-client";

const socket = socketIOClient("localhost:5000");

const routing = (
    <HashRouter history={hashHistory}>
        <Switch>
            <Route 
                path='/canva'
                render={(props) => <Canvas {...props} socket={socket} />}
            />
            <Route 
                path='/webpage' 
                render={(props) => <Webpage {...props} socket={socket} />}
            />
        </Switch>
    </HashRouter>
)

ReactDOM.render(routing, document.getElementById("content"));