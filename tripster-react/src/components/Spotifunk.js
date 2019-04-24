import React from "react";
import {Button} from "antd";
import querystring from "querystring";

export class Spotifunk extends React.Component {
    login() {
        const generateRandomString = function (length) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < length; i += 1) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        const state = generateRandomString(16);
        const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative';
        window.open(`https://accounts.spotify.com/authorize?${
            querystring.stringify({
                response_type: 'code',
                client_id: '682367fe3a8a41a0b81f34dc5c6fe936',
                scope,
                redirect_uri: 'http://localhost:8888/callback' ,
                state})
            })}`, '_self');


    }
    render() {
        return (
            <div>
                <Button class="spotifunk-button" onClick={() => this.login()}>Spotifunk</Button>
            </div>
        );
    }
}

export default Spotifunk
