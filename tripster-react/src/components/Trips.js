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
        const renderTrips = trips.map(trip => (
            <div className="trip-item">
                <Card
                    type="inner"
                    style={{
                        backgroundColor: '#d4ecdc',
                        width: '300px',
                        textAlign: 'center',
                        margin: '0px',
                        borderRadius: '10px',
                    }}
                >
                    <p className="trip-name">{trip.name}</p>
                    <p className="trip-content">{trip.date}</p>
                    <Button>View Trip</Button>
                </Card>
            </div>
        ));
        const newTripCard = (
            <div className="trip-item">
                <Card
                    type="inner"
                    bordered={true}
                    style={{
                        backgroundColor: 'blue',
                        width: '300px',
                        textAlign: 'center',
                        margin: '0px',
                        borderRadius: '10px',
                        borderStyle: 'dashed !important'
                    }}
                >
                    <p className="trip-name">+</p>
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
                    <a onClick={() => this.logout()}>Logout</a>
                </Menu.Item>
            </Menu>
        );
        return (
          <section className="hero is-light is-fullheight">

            <div className="hero-head">

              <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                  <a className="navbar-item">
                    <img src="../images/tripster.png" width="112" height="28"/>
                  </a>
                </div>
                <div className="navbar-menu">

                </div>
                <div className="navbar-end">
                  <a className="navbar-item">
                    <Dropdown overlay={menu} >
                      <img src={cookie.load("picture")} />
                    </Dropdown>
                  </a>
                </div>

              </nav>

            </div>

            <div class="hero-body">

              <div className="trips-container">
                {this.renderTrips()}
              </div>

            </div>

            <div className="hero-foot">
            </div>

          </section>

        );
    }
}

export default withRouter(Trips)
