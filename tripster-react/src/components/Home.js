import React from "react";
import FacebookLogin from 'react-facebook-login';
import { withRouter } from 'react-router-dom';
import cookie from 'react-cookies'
import request from 'request'

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
        var options = { method: 'POST',
            url: 'http://localhost:8888/authenticate',
            headers:
                { 'Content-Type': 'application/x-www-form-urlencoded' },
            form:
                { email: response.email,
                    name: response.name,
                    picture: response.picture.data.url,
                    user_id: response.userID
                } };

        request(options, function (error, resp, body) {
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
            this.props.history.push('/trips');;
        }.bind(this));

    }

    componentDidMount(){
        if(cookie.load('isLoggedIn')){
            this.props.history.push('/trips');
        }
    }

    render() {
        return (
            <section class="hero is-fullheight">
                <div class="hero-head">

                    <nav className="navbar" role="navigation" aria-label="main navigation">
                        <div className="navbar-brand">
                            <a className="navbar-item">
                                <img alt="" src="https://github.com/lrisTech/Tripster/blob/master/tripster-react/src/images/tripster.png?raw=true"/>

                            </a>
                        </div>
                        <div className="navbar-menu">

                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="buttons">
                                    <a className="button is-link">
                                        <strong>Sign up</strong>
                                    </a>
                                    <a className="button is-light">
                                        Log in
                                    </a>
                                </div>
                            </div>
                        </div>

                    </nav>

                </div>



                <div class="hero-body">

                    <div className="column is-6 is-offset-1 has-text-left">
                        <h1 className="title has-text-weight-bold">
                            Welcome to Tripster
                        </h1>
                        <p>

                        </p>
                        <p class="subtitle is-5">
                            Tripster is a web-application that allows you to find fun places during your road trip. We use Yelp's API to give you the best possible options to visit.
                        </p>
                        <a>
                            <FacebookLogin
                              appId="242487039919018"
                              autoLoad={false}
                              fields="name,email,picture"
                              callback={response => this.responseFacebook(response)}
                              onFailure={() => this.props.history.push("/")}
                            />
                        </a>
                    </div>

                    <div class="column is-4">
                        <h1 class="has-text-centered">
                            <img alt="" src="https://images-na.ssl-images-amazon.com/images/I/61m0oPPL%2BKL._SX466_.jpg"/>
                        </h1>
                    </div>


                </div>


            </section>
        );
    }
}

export default withRouter(Home)
