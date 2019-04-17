import React from "react";
import FacebookLogin from 'react-facebook-login';
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
            <section class="hero is-fullheight">
                <div class="hero-head">

                    <nav className="navbar" role="navigation" aria-label="main navigation">
                        <div className="navbar-brand">
                            <a className="navbar-item">
                                <img src="tripster.jpg" alt="Logo"/>

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
                            {fbContent}
                        </a>
                    </div>

                    <div class="column is-4">
                        <h1 class="has-text-centered">
                            <img src="https://images-na.ssl-images-amazon.com/images/I/61m0oPPL%2BKL._SX466_.jpg"/>
                        </h1>
                    </div>


                </div>

                <div class="hero-foot">
                    <footer className="footer">
                        <div className="content has-text-centered">
                            <p>
                                <strong>Created by Tripster: Use scss & variables to edit footer size</strong>
                            </p>
                        </div>
                    </footer>
                </div>

            </section>

        );
    }
}

export default withRouter(Home)
