import React from "react";
import { withRouter } from 'react-router-dom';
import request from 'request';
import { Card, Button, Menu, Dropdown, Icon } from 'antd';
import "../stylesheets/trips.css"
import cookie from 'react-cookies'
import {backendURL} from "../dependency";

export class Trips extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            trips: []
        }
    }
    createNewTrip(){
        var options = {
            method: 'POST',
            url: `${backendURL}/new-trip`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                user_id: cookie.load("userID"),
                email: cookie.load("email"),
            }
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const trip_id = (body.replace('"', '')).replace('"', '')
            this.props.history.push(`/plan-trip?trip_id=${trip_id}`)
        }.bind(this));

    }

    deleteTrip(trip_id){
        let options = {
            method: 'POST',
            url: `${backendURL}/delete-trip`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            form: {
                user_id: cookie.load("userID"),
                email: cookie.load("email"),
                trip_id: trip_id,
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            this.setState({trips: body.data})
        }.bind(this));
    }
    viewTrip(trip_id){
        this.props.history.push(`/plan-trip?trip_id=${trip_id}`)
    }
    renderTrips(){
        const renderTrips = this.state.trips.map(trip => (
            <div className="trip-item">
              <div className="card">
                <header className="card-header has-text-centered">
                  <p className="card-header-title is-size-5 has-text-weight-light">
                    {trip.trip_name}
                  </p>
                  <a href="" className="card-header-icon" aria-label="more options">
                    <span className="icon">
                      <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </a>
                </header>
                <div className="card-content">
                  <div className="content">
                    <p className="is-size-6 has-text-weight-light">{trip.trip_date}</p>
                  </div>
                </div>
                <footer className="card-footer">
                  <a href="" className="card-footer-item" onClick={() => this.viewTrip(trip._id)}>View Trip</a>
                  <a href="" className="card-footer-item" onClick={() => this.deleteTrip(trip._id)}>Delete</a>
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
                <a href="" className="card-header-icon" aria-label="more options">
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
        } else {
            let options = {
                method: 'GET',
                url: `${backendURL}/view-trips`,
                qs: {
                    email: cookie.load("email"),
                    user_id: cookie.load("userID")
                },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                this.setState({trips: body.data})
            }.bind(this));
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
                      <img alt="" src="https://github.com/lrisTech/Tripster/blob/master/tripster-react/src/images/tripster.png?raw=true"/>
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

            <div className="hero-body">

              <div className="trips-container">
                {this.renderTrips()}
              </div>

            </div>

          </section>

        );
    }
}

export default withRouter(Trips)
