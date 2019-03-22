import {Map, InfoWindow, Marker, GoogleApiWrapper, Polygon, Polyline} from 'google-maps-react';
import React from 'react'

export class MapContainer extends React.Component {
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
                <input placeholder={"Origin"} onChange={origin_input => console.log(origin_input.target.value)}></input>
                <input placeholder={"Destination"} onChange={destination_input => console.log(destination_input.target.value)}></input>
                <button>Calculate</button>
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
