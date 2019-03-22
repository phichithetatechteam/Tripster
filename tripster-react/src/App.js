import {Map, InfoWindow, Marker, GoogleApiWrapper, Polygon, Polyline} from 'google-maps-react';
import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
import './App.css'

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            origin_address: '',
            destination_address: '',
            origin_obj:{},
            destination_obj:{}
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
        console.log(this.state.origin_obj);
        console.log(this.state.destination_obj);

        const origin_lat = this.state.origin_obj.lat;
        const origin_lon = this.state.origin_obj.lng;
        const destination_lat = this.state.destination_obj.lat;
        const destination_lon = this.state.destination_obj.lng;
    }

    render() {
        // const triangleCoords = [
        //     {lat: 37.759703, lng: -122.428093},
        //     {lat: 37.7614169, lng: -122.4240931},
        //
        // ];
        const triangleCoords = [
            {lat: 37.759703, lng: -122.428093},
            {lat: 37.7612896, lng: -122.4283997},
            {lat: 37.7615595, lng: -122.4241079},
            {lat: 37.7614169, lng: -122.4240931},

        ];

        return (
            <div>

                <PlacesAutocomplete
                    value={this.state.origin_address}
                    onChange={this.handleChangeOrigin}
                    onSelect={this.handleSelectOrigin}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <input
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
                            <input
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



                <button className="button" onClick={() => this.calculate_distance()}>Calculate</button>

                <Map google={this.props.google} zoom={14}>
                    <Marker
                        name={'Dolores park'}
                        position={{lat: 37.759703, lng: -122.428093}} />
                    <Marker
                        name={'Tartine Bakery'}
                        position={{lat: 37.7614169, lng: -122.4240931}} />


                    <Polyline
                        path={triangleCoords}
                        strokeColor="#0000FF"
                        strokeOpacity={4}
                        strokeWeight={10} />
                </Map>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyChbG4vc4a01alWP7RYrMvWd911uhGzOdo\n")
})(MapContainer)
