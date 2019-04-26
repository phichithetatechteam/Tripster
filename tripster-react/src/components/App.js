import {Map, Marker, GoogleApiWrapper, Polyline, InfoWindow} from 'google-maps-react';
import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete';
import 'antd/dist/antd.css';
import { Input, Button, Radio, Card, Checkbox, Select, Calendar, Popover, Icon} from 'antd';
import { withRouter } from 'react-router-dom';
import {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import '../stylesheets/App.css'
import './Spotifunk'
import request from 'request'
import Spotifunk from "./Spotifunk";
import Steps from "./Steps";
import cookie from "react-cookies";
import moment from 'moment';
import {backendURL} from "../dependency";

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const tripster_stops_1 = [
    { label: 'Active Life', value: 'Active Life'},
    { label: 'Entertainment', value: 'Arts & Entertainment' },
];
const tripster_stops_2 = [
    { label: 'Nightlife', value: 'Nightlife' },
    { label: 'Restaurants', value: 'Restaurants' },
];
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trip_name: '',
            origin_address: '',
            destination_address: '',
            origin_obj: {},
            destination_obj: {},
            stops: [],
            addition_markers: undefined,
            sort_by: 'best_match',
            price: "1",
            waypoints: [],
            waypoints_db_obj: [],
            driving_result: {},
            trip_id: '',
            trip_date: undefined,

        };
    }
    componentDidMount(){
        const trip_id = this.props.history.location.pathname.split("/")[2];
        console.log(trip_id)
        var options = {
            method: 'GET',
            url: `${backendURL}/view-trip`,
            qs: {
                email: cookie.load('email'),
                user_id: cookie.load('userID'),
                trip_id: trip_id
            },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let parsedTrip = {};
            try{
                parsedTrip = this.parseDBTrip(body);
                parsedTrip.trip_id = trip_id;
                this.setState(parsedTrip);
                this.calculate_distance()
            } catch(e){
                parsedTrip.trip_id = trip_id;
                this.setState(parsedTrip);
            }

        }.bind(this));
    }


    parseDBTrip(body){
        let parsedTrip = body;
        parsedTrip.origin_obj.lat = parseFloat(parsedTrip.origin_obj.lat);
        parsedTrip.origin_obj.lng = parseFloat(parsedTrip.origin_obj.lng);
        parsedTrip.destination_obj.lat = parseFloat(parsedTrip.destination_obj.lat);
        parsedTrip.destination_obj.lng = parseFloat(parsedTrip.destination_obj.lng);
        parsedTrip.waypoints_db_obj = body.waypoints;
        delete parsedTrip.waypoints;
        parsedTrip.waypoints = [];
        for (let waypoint in parsedTrip.waypoints_db_obj){
            parsedTrip.waypoints_db_obj[waypoint] = {
                lat: parseFloat(parsedTrip.waypoints_db_obj[waypoint].lat),
                lng: parseFloat(parsedTrip.waypoints_db_obj[waypoint].lng)
            }
            parsedTrip.waypoints[waypoint] = {
                location: new this.props.google.maps.LatLng(parsedTrip.waypoints_db_obj[waypoint].lat,parsedTrip.waypoints_db_obj[waypoint].lng),
                stopover: true
            };

        }
        return parsedTrip
    }

    handleChangeOrigin = origin_address => {
        this.setState({
            origin_address
        });
    };

    handleSelectOrigin = origin_address => {
        geocodeByAddress(origin_address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({origin_obj : latLng}))
            .catch(error => console.error('Error', error));
        this.setState({origin_address})
    };

    handleChangeDestination = destination_address => {
        this.setState({
            destination_address
        });
    };

    handleSelectDestination = destination_address => {
        geocodeByAddress(destination_address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({destination_obj: latLng}))
            .catch(error => console.error('Error', error));
        this.setState({destination_address})
    };

    calculate_distance() {
        if (isEmpty(this.state.origin_obj) || isEmpty(this.state.destination_obj)){
            return
        }
        const DirectionsService = new this.props.google.maps.DirectionsService();
        DirectionsService.route({
            origin: this.state.origin_address,
            destination: this.state.destination_address,
            waypoints: this.state.waypoints,
            optimizeWaypoints: true,
            travelMode: this.props.google.maps.TravelMode.DRIVING,
        }, (result, status) => {

            var bounds = new this.props.google.maps.LatLngBounds();
            try{
                const all_steps = (result.routes[0].overview_path)
                for (let step in all_steps){
                    let current_step_json = all_steps[step].toJSON()
                    bounds.extend(current_step_json);
                }
                this.setState({'steps': result.routes[0].overview_path, bounds, driving_result: result})
            } catch (e){
                console.log("ERR")
            }
        });


        var options = { method: 'GET',
            url: `${backendURL}/calculate-distance`,
            qs: {
                origin_lat: this.state.origin_obj.lat,
                origin_lng: this.state.origin_obj.lng,
                destination_lat: this.state.destination_obj.lat,
                destination_lng: this.state.destination_obj.lng,
                sort_by: this.state.sort_by,
                price: this.state.price,
                stops: this.state.stops
            },
            headers:
                { 'Postman-Token': '172aa67b-54c6-4116-9000-9a22e9480045',
                    'cache-control': 'no-cache' } };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            var json = body;
            var json_stops = JSON.parse(json).stops;

            const additional_markers = json_stops.map((stop) =>
                <Marker
                    onMouseover={(props, marker, e) => this.displayInfoWindow(props, marker, e)}
                    stop={stop}
                    key={stop.image_url}
                    position={{lat: stop.coordinates.latitude, lng: stop.coordinates.longitude}}
                    onClick={() => this.setWayPoint(stop.coordinates.latitude, stop.coordinates.longitude)}
                />
            );
            this.setState({additional_markers})

        }.bind(this));
    }

    displayInfoWindow(props, marker, e) {
        const infoWindow = (
            <InfoWindow
                marker={marker}
                visible={true} >
                <div>
                    <h3><a href={props.stop.url}>{props.stop.name}</a></h3>
                    <img src={props.stop.image_url} alt="" height="20%" width="20%" />
                    <p>Rating: {props.stop.rating}/5.0</p>
                    <p>{props.stop.phone}</p>

                    <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96" onClick={() => console.log("DELETE STOP")}/>
                </div>
            </InfoWindow>
        );
        this.setState({infoWindow})
    }

    setWayPoint(lat, lng){
        this.setState({waypoints:[...this.state.waypoints, {
                location: new this.props.google.maps.LatLng(lat,lng),
                stopover: true
            }], waypoints_db_obj:[...this.state.waypoints_db_obj, {
                lat,
                lng
            }]});
        this.calculate_distance()
    }



    saveTrip(){
        const trip = {
            trip_name: this.state.trip_name,
            origin_address: this.state.origin_address,
            destination_address: this.state.destination_address,
            origin_obj: this.state.origin_obj,
            destination_obj: this.state.destination_obj,
            trip_date: this.state.trip_date,
            price: this.state.price,
            sort_by: this.state.sort_by,
            stops: this.state.stops,
            waypoints: this.state.waypoints_db_obj,
        };

        let options = {
            method: 'POST',
            url: `${backendURL}/save-trip`,
            qs: { trip_id: this.state.trip_id, email: cookie.load("email"), user_id: cookie.load("userID")},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            form: trip
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    }

    render() {
        console.log("STATE", this.state)
        const content = (
            <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                <Calendar
                    fullscreen={false}
                    onChange={(date) => this.setState({trip_date: date._d.toISOString()})}
                    value={this.state.trip_date ? moment(this.state.trip_date) : moment("2019-04-11T15:13:58.867Z")}
                />
            </div>
        )
        return (

            <div>
                <Input style={{"width": "90%", "borderRight": "10px"}} placeholder={"Enter a name of your trip"} value={this.state.trip_name} onChange={(event) => this.setState({trip_name: event.target.value})}/>
                <Popover content={content} title="Travel Date" trigger="click">
                    <Icon type="calendar" />
                </Popover>
            <div className="flex-container">


                <div className="flex-container-div-left">


                    <Card class="is-size-1"
                        title="Tripster Stops"
                        extra={<Icon type="save" theme="twoTone"onClick={() => this.saveTrip()}/>}
                    >
                        <PlacesAutocomplete
                            value={this.state.origin_address}
                            onChange={this.handleChangeOrigin}
                            onSelect={this.handleSelectOrigin}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <Input
                                        {...getInputProps({
                                            placeholder: 'Origin',
                                            className: 'location-search-input',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>

                        <PlacesAutocomplete
                            value={this.state.destination_address}
                            onChange={this.handleChangeDestination}
                            onSelect={this.handleSelectDestination}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <Input
                                        {...getInputProps({
                                            placeholder: 'Destination',
                                            className: 'location-search-input',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                        <br />

                        <div>
                            <CheckboxGroup
                                options={tripster_stops_1}
                                value={this.state.stops}
                                onChange={stops => this.setState({stops})}
                            />
                            <br/><br/>
                            <CheckboxGroup
                                options={tripster_stops_2}
                                value={this.state.stops}
                                onChange={stops => this.setState({stops})}
                            />
                        </div>
                        <br/>
                        <p className={"sort-by"}>Sort By: </p>
                        <Select value={this.state.sort_by} style={{width: 150}} max={51} onChange={(sort_by) => this.setState({sort_by})}>
                            <Option value="best_match" >Best Match</Option>
                            <Option value="rating">Rating</Option>
                            <Option value="review_count">Review Count</Option>
                            <Option value="distance">Distance</Option>
                        </Select>
                        <br/><br/>

                        <Radio.Group value={this.state.price} buttonStyle="solid" onChange={price => this.setState({price: price.target.value})}>
                            <Radio.Button value="1">$</Radio.Button>
                            <Radio.Button value="2">$$</Radio.Button>
                            <Radio.Button value="3">$$$</Radio.Button>
                            <Radio.Button value="4">$$$$</Radio.Button>
                        </Radio.Group>

                        <p></p>

                        <Button onClick={() => this.calculate_distance()}>Calculate</Button>

                    </Card>

                        <Spotifunk/>

                </div>

                <div className="flex-container-div-right">

                    <Map className="googlemaps" google={this.props.google} zoom={5} bounds={this.state.bounds}>
                        <Marker
                            position={{lat: this.state.origin_obj.lat, lng: this.state.origin_obj.lng}} />
                        <Marker
                            position={{lat: this.state.destination_obj.lat, lng: this.state.destination_obj.lng}} />
                        {this.state.additional_markers}
                        <Polyline
                            path={this.state.steps}
                            geodesic={false}
                            strokeColor="#0000FF"
                            strokeOpacity={3}
                            strokeWeight={8}
                        />
                        {this.state.infoWindow}

                    </Map>
                    <Steps driving_result={this.state.driving_result}/>

                </div>


            </div>
            </div>


        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyChbG4vc4a01alWP7RYrMvWd911uhGzOdo")
})(withRouter(MapContainer))
