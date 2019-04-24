import React from "react";
import { withRouter } from 'react-router-dom';
import { Card, Button, Menu, Dropdown } from 'antd';
import "../stylesheets/trips.css"
import cookie from 'react-cookies'



export class Trips extends React.Component {
    createNewTrip(){
        this.props.history.push("/plan-trip")
    }
    renderTrips(){
        let trips = []
        const obj = {"name": "Chicago Adventure", "date": "Feb 3"}
        trips.push(obj)
        trips.push(obj)
        trips.push(obj)
        trips.push(obj)
        trips.push(obj)
        const renderTrips = trips.map(trip => (
            <div className="trip-item">
              <div className="card">
                <header className="card-header has-text-centered">
                  <p className="card-header-title is-size-5 has-text-weight-light">
                    {trip.name}
                  </p>
                  <a href="#" className="card-header-icon" aria-label="more options">
                    <span className="icon">
                      <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </a>
                </header>
                <div className="card-content">
                  <div className="content">
                    <p className="is-size-6 has-text-weight-light">{trip.date}</p>
                  </div>
                </div>
                <footer className="card-footer">
                  <a href="#" className="card-footer-item">View Trip</a>
                  <a href="#" className="card-footer-item">Delete</a>
                </footer>
              </div>
            </div>



        ));
        const newTripCard = (

          <div className="trip-item">
            <div className="card">
              <header className="card-header has-text-centered">
                <p className="card-header-title is-size-5 has-text-weight-light">
                  Add a new trip!
                </p>
                <a href="#" className="card-header-icon" aria-label="more options">
                    <span className="icon">
                      <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </a>
              </header>
              <div className="card-content">
                <div className="content">
                  <p className="is-size-6 has-text-weight-light">+</p>
                </div>
              </div>
              <footer className="card-footer">
                <a onClick={() => this.createNewTrip()} className="card-footer-item">Click here to add a new trip!</a>
              </footer>
            </div>
          </div>
        )

        renderTrips.push(newTripCard)
        return renderTrips
    }

    componentDidMount(){
        if (!cookie.load("isLoggedIn")){
            this.props.history.push("/")
        }
    }

    logout(){
        cookie.remove("isLoggedIn")
        cookie.remove("userID")
        cookie.remove("name")
        cookie.remove("email")
        cookie.remove("picture")
        this.props.history.push("/")
    }


    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <p>Email: {cookie.load("email")}</p>
                </Menu.Item>
                <Menu.Item>
                    <Button onClick={() => this.logout()}>Logout</Button>
                </Menu.Item>
            </Menu>
        );
        return (
          <section className="hero is-light is-fullheight">

            <div className="hero-head">

              <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                  <a className="navbar-item">
                      <img src="https://github.com/lrisTech/Tripster/blob/master/tripster-react/src/images/tripster.png?raw=true"/>
                  </a>
                </div>
                <div className="navbar-menu">

                </div>
                <div className="navbar-end">
                  <a className="navbar-item">
                    <Dropdown overlay={menu} >
                        <img src={cookie.load("picture")} alt=""/>
                    </Dropdown>
                  </a>
                </div>

              </nav>

            </div>

            <div class="hero-body">

              <div className="trips-container">
                {this.renderTrips()}

                  <iframe class="spotify" src="https://open.spotify.com/embed/track/6u7jPi22kF8CTQ3rb9DHE7" width="325" height="450"
                          frameBorder="0" allowTransparency="true" allow="encrypted-media"></iframe>
              </div>

            </div>

          </section>

        );
    }
}

export default withRouter(Trips)
