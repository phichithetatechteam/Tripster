import React from "react";
import {Button, Card} from "antd";
import { withRouter } from 'react-router-dom';

export class Home extends React.Component {
    render() {
        return (
            <div>
                <Card>
                    <Button
                        type="primary"
                        onClick={() => console.log("Do login with facebook functionality")}
                    >Login With Facebook
                    </Button>
                </Card>

            </div>
        );
    }
}

export default withRouter(Home)
