import React from "react";
import {Card, Button, Icon, Collapse} from 'antd';
import { withRouter } from 'react-router-dom';
import '../stylesheets/steps.css'

const Panel = Collapse.Panel;

export class Steps extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isStepsShowing: false,
            divStyle: {'position': 'absolute', 'left': '0', 'bottom': '0', 'width': '60%'},
            cardStyle: {'width': '50%'},
            steps: []
        }
    }

    calculate_distance_duration(routes){
        let distance = 0
        let duration = 0
        for (let route in routes){
            for (let leg in routes[route].legs){
                distance += routes[route].legs[leg].distance.value
                duration += routes[route].legs[leg].duration.value
            }
        }
        return {'duration': Math.round(duration*0.0166667), 'distance': Math.round(distance*0.000621371)}
    }

    showSteps(){
        if (this.state.isStepsShowing){
            this.setState({
                isStepsShowing: false,
                divStyle: {'position': 'absolute', 'left': '0', 'bottom': '0', 'width': '60%'},
                cardStyle: {'width': '50%'},
            })
        } else {
            this.setState({
                isStepsShowing: true,
                divStyle: {'left': '0', 'bottom': '0', 'width': '60%', 'height': '100%'},
                cardStyle: {'width': '50%', 'height': '100%', },
            })
        }
    }


    renderTurns(turns){
        const renderedTurns = turns.map((turn) =>
            <div className={"stop-div"}>
                <p className={"stop-item-left"}>{turn.distance.text}</p>
                <p className={"stop-item-right"}>{turn.instructions.replace(/<[^>]+>/g, '')}</p>
            </div>
        );
        return renderedTurns
    }

    renderSteps(){
        console.log(this.props.driving_result)
        let renderedSteps = [];
        let origin_div = (
            <div className={"stop-div"} key={this.props.driving_result.request.origin.query}>
                <Icon type="star" className={"stop-item-left"}/>
                <p className={"stop-item-right"}>{this.props.driving_result.request.origin.query}</p>
            </div>


        );
        renderedSteps.push(origin_div)

        const current_route = this.props.driving_result.routes[0].legs;

        let renderedLegs = []
        for (let leg in current_route){
            console.log(current_route[leg])
            let stop = (
                <Panel header={current_route[leg].end_address} key={current_route[leg].end_address + current_route[leg].start_address}>
                    {this.renderTurns(current_route[leg].steps)}
                </Panel>
            )
            renderedLegs.push(stop)
        }
        let allStops = (
            <Collapse>
                {renderedLegs}
            </Collapse>
        )
        renderedSteps.push(allStops)
        let destination_div = (
            <div className={"stop-div"} key={this.props.driving_result.request.destination.query}>
                <Icon type="star" className={"stop-item-left"}/>
                <p className={"stop-item-right"}>{this.props.driving_result.request.destination.query}</p>
            </div>

        )
        renderedSteps.push(destination_div)

        // renderedSteps.push(driving_result.routes.map((step) =>
        //     <p>{"TEST"}</p>
        // ));

        return renderedSteps
    }

    render() {
        let distance_duration = this.calculate_distance_duration(this.props.driving_result.routes)
        return (
            <div style={this.state.divStyle}>
                <Card style={this.state.cardStyle} className={"steps-card"}>
                    <p>~{distance_duration.duration} min ({distance_duration.distance} mi)</p>
                    {this.state.isStepsShowing ? this.renderSteps() : ""}
                    <Button onClick={() => this.showSteps()}>Steps</Button>
                </Card>
            </div>

        );
    }
}

export default withRouter(Steps)
