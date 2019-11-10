import React, { Component } from 'react';
import {
  Circle,
} from 'react-leaflet';


export default class AnimatedCircle extends Component {

    constructor(props) {
        super(props);

        this.state = {
            animatedRadius : 0
        }
    }


    componentDidMount() {
        this.interval = setInterval( () => {
            if (this.state.animatedRadius >= 100000) {
                clearInterval(this.interval);
                this.props.delete(this.props.id);
            }
            else {
              const nextAnimatedRadius = this.state.animatedRadius + 1000;
              this.setState({ animatedRadius : nextAnimatedRadius});
            }
          }, 10);
      }

      render() {
          return (
            <Circle 
                center={this.props.center} 
                fill={this.props.fill} 
                radius={this.state.animatedRadius} />
        )
      }
}