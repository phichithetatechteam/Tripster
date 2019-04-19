import React from "react";
import FacebookLogin from 'react-facebook-login';
import { withRouter } from 'react-router-dom';
import cookie from 'react-cookies'

export class Home extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isLoggedIn: false,
            userID: '',
            name: '',
            email: '',
            picture: ''
        }
    }



    responseFacebook(response) {
        cookie.save('isLoggedIn', true)
        cookie.save('userID', response.userID)
        cookie.save('name', response.name)
        cookie.save('email', response.email)
        cookie.save('picture', response.picture.data.url)
        this.setState({
            isLoggedIn: true,
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        });
        this.props.history.push('/trips');
    }

    componentDidMount(){
        if(cookie.load('isLoggedIn')){
            this.props.history.push('/trips');
        }
    }

    render() {
        return (
            <div>
                <h1>Welcome to Tripster</h1>
                <FacebookLogin
                    appId="242487039919018"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={response => this.responseFacebook(response)}
                    onFailure={() => this.props.history.push("/")}
                />
            </div>

        );
    }
}

export default withRouter(Home)
