import React from "react";
import { withRouter } from 'react-router-dom';

export class Trips extends React.Component {
    render() {
        return (
            <div>
                <h1>Your Trips</h1>
            </div>
        );
    }
}

export default withRouter(Trips)
