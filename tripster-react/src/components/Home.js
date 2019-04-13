import React from "react";
import FacebookLogin from 'react-facebook-login';
import {Button, Card} from "antd";
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import cookie from 'react-cookies'

export class Home extends React.Component {

    state = {
        isLoggedIn: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    }

    responseFacebook = response => {
        console.log(response);

        this.setState({
            isLoggedIn: true,
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        });
    }

    componentClicked = () => console.log("clicked");

    render() {

        let fbContent;

        if (this.state.isLoggedIn) {
            // return <Redirect to='/trips' />
            cookie.save('isLoggedIn', this.state.isLoggedIn)
            cookie.save('userID', this.state.userID)
            cookie.save('name', this.state.name)
            cookie.save('email', this.state.email)
            cookie.save('picture', this.state.picture)
            this.props.history.push('/trips');
        }

        else {
            fbContent = (<FacebookLogin
                appId="242487039919018"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}
                onFailure={() => this.props.history.push("/")}
                />);
        }

        return (
            <div>
                <h1>Welcome to Tripster</h1>
                {fbContent}

            </div>

        );
    }
}

export default withRouter(Home)
