import React from "react";
import FacebookLogin from 'react-facebook-login';
import {Button, Card} from "antd";
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export class Home extends React.Component {

    state = {
        isLoggedIn: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    }

    responseFacebook = response => {
        // console.log(response);

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

            this.props.history.push('/trips');
        }

        else {
            fbContent = (<FacebookLogin
                appId="242487039919018"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />);
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
