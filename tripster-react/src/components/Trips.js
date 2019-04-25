import React from "react";
import { withRouter } from 'react-router-dom';
import request from 'request';
import { Card, Button, Menu, Dropdown, Icon } from 'antd';
import "../stylesheets/trips.css"
import cookie from 'react-cookies'

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
            url: 'http://localhost:8888/new-trip',
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
            this.props.history.push(`/plan-trip/${trip_id}`)
        }.bind(this));

    }

    deleteTrip(trip_id){
        let options = {
            method: 'POST',
            url: 'http://localhost:8888/delete-trip',
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
        this.props.history.push(`/plan-trip/${trip_id}`)
    }
    renderTrips(){
        const renderTrips = this.state.trips.map(trip => (
            <div className="trip-item" key={trip._id}>
                <Card
                    type="inner"
                    style={{
                        backgroundColor: '#CDC29E',
                        width: '323.5px',
                        height: '130px',
                        textAlign: 'center',
                        margin: '0px',
                        borderRadius: '10px',
                    }}
                    key={trip._id}
                >

                    <p className="trip-name is-family-primary">{trip.trip_name}</p>
                    <p className="trip-content is-family-secondary">{trip.trip_date}</p>
                    <Button className="is-family-primary" onClick={() => this.viewTrip(trip._id)}>View Trip</Button>
                    <Icon type="delete" onClick={() => this.deleteTrip(trip._id)}/>
                </Card>
            </div>
        ));
        const newTripCard = (
            <div className="trip-item" >
                <Card
                    type="inner"
                    bordered={true}
                    style={{
                        backgroundColor: '#add8e6',
                        width: '300px',
                        textAlign: 'center',
                        margin: '0px',
                        borderRadius: '10px',
                        borderStyle: 'dashed !important'
                    }}
                >
                    <p className="trip-name has-text-weight-bold has-text-white-bis is-size-4">+</p>
                    <h1> </h1>
                    <Button onClick={() => this.createNewTrip()}>Create a New Trip</Button>
                </Card>
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
                url: 'http://localhost:8888/view-trips',
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
