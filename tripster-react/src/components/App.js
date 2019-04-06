import {Map, Marker, GoogleApiWrapper, Polyline} from 'google-maps-react';
import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete';
import 'antd/dist/antd.css';
import querystring from 'querystring';
import { Input, Button, Radio, Icon, Card, Checkbox, Slider } from 'antd';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import '../stylesheets/App.css'

const CheckboxGroup = Checkbox.Group;

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            origin_address: '',
            destination_address: '',
            origin_obj: {},
            destination_obj: {},
            stops: []
        };
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
        console.log(this.state);
        const DirectionsService = new this.props.google.maps.DirectionsService();
        DirectionsService.route({
            origin: this.state.origin_address,
            destination: this.state.destination_address,
            travelMode: this.props.google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            var bounds = new this.props.google.maps.LatLngBounds();
            try{
                const all_steps = (result.routes[0].overview_path)
                for (let step in all_steps){
                    let current_step_json = all_steps[step].toJSON()
                    bounds.extend(current_step_json);
                }
                this.setState({'steps': result.routes[0].overview_path, bounds})
            } catch (e){
                console.log("ERR")
            }
        });

        var request = require("request");

        var options = { method: 'GET',
            url: 'http://localhost:8888/calculate-distance',
            qs: {
                origin_lat: this.state.origin_obj.lat,
                origin_lng: this.state.origin_obj.lng,
                destination_lat: this.state.destination_obj.lat,
                destination_lng: this.state.destination_obj.lng,
                stops: this.state.stops
            },
            headers:
                { 'Postman-Token': '172aa67b-54c6-4116-9000-9a22e9480045',
                    'cache-control': 'no-cache' } };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        }.bind(this));

    }

    connect_spotify() {
        var request = require("request");

        var options = { method: 'GET',
            url: 'http://localhost:8888/spotifunk',
            qs:
                { client_id: 'c3c198763ae0451fa0aeeab520a607a8',
                    response_type: 'code',
                    redirect_uri: 'https://localhost:3000/' },
            headers:
                { 'Postman-Token': 'ddc8061d-ac87-4778-aadc-be3796fca285',
                    'cache-control': 'no-cache' } };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        }.bind(this));
    }

    //redirects you to the login page for Spotify
    //only works if you are currently not logged into Spotify.
    login() {
        const stateKey = 'spotify_auth_state';
        const generateRandomString = function (length) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < length; i += 1) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        const state = generateRandomString(16);
        //cookies.set(stateKey, state);
        const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative';
        window.open(`https://accounts.spotify.com/authorize?${
            querystring.stringify({
                response_type: 'code',
                client_id: '682367fe3a8a41a0b81f34dc5c6fe936',
                scope,
                redirect_uri: 'http://localhost:3000/' ,
                state})
            })}`, '_self');
    }

    render() {
        const plainOptions = ['Active Life', 'Arts & Entertainment', 'Nightlife', 'Restaurants', 'Hotels & Travel'];
        return (
            <div class="flex-container">

                <div class="flex-container-div-left">
                    <h1>Tripster</h1>
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
                        <div className>
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

                    <Card
                        title="Tripster Stops"
                    >
                        <CheckboxGroup options={plainOptions} onChange={stops => this.setState({stops})} />
                    </Card>

                    <Button type="primary" onClick={() => this.calculate_distance()}>Calculate</Button>
                    <Button type="primary" onClick={() => this.login()}>Spotifunk</Button>
                </div>

                <div class="flex-container-div-right">

                    <Map className="googlemaps" google={this.props.google} zoom={5} bounds={this.state.bounds} center={{lat: this.state.origin_obj.lat, lng: this.state.origin_obj.lng}}>
                        <Marker
                            position={{lat: this.state.origin_obj.lat, lng: this.state.origin_obj.lng}} />
                        <Marker
                            position={{lat: this.state.destination_obj.lat, lng: this.state.destination_obj.lng}} />
                        <Polyline
                            path={this.state.steps}
                            geodesic={false}
                            strokeColor="#0000FF"
                            strokeOpacity={4}
                            strokeWeight={10}
                        />
                    </Map>

                </div>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyChbG4vc4a01alWP7RYrMvWd911uhGzOdo")
})(MapContainer)
