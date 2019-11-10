import React, { Component } from 'react';
import AnimatedCircle from './AnimatedCircle';
import location_to_coordinates from './../location_to_coordinates.json';
import subreddit_to_location from './../subreddit_to_location';
import {
  Map,
  TileLayer
} from 'react-leaflet';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient.connect('http://localhost:5000')

export default class AnimatedCircleMap extends Component {

  constructor(props) {
    super(props);

    this.addMarkerHandler = this.addMarkerHandler.bind(this);
    this.deleteMarkerHandler = this.deleteMarkerHandler.bind(this);

    this.auto_incrementer = 0;
    this.center = [37.338207, -121.886330];
    this.zoom = 5;

    this.state = {
      markers : []
    }
  }

  componentDidMount() {
    this.setSocketListener();
  }

  setSocketListener() {
    socket.on('message', (message) => {
      console.log(message);
            
      if (message.subreddit.toLowerCase() in subreddit_to_location) {
        this.addMarkerHandler(subreddit_to_location[message.subreddit.toLowerCase()])
      }
    });
  }

  scrambleEggs(coordinates) {
    if (Math.random() < 0.5) {
      coordinates = coordinates - Math.random()
    } else {
      coordinates = coordinates + Math.random()
    }
    return coordinates;
  }

  addMarkerHandler(location) {
    if (location in location_to_coordinates) {
      var newMarkers = this.state.markers;
      var position = location_to_coordinates[location].slice(); //deep copy
      position[0] = this.scrambleEggs(position[0]);
      position[1] = this.scrambleEggs(position[1]);  
      newMarkers.push({
        location : location,
        position : position,
        id : this.auto_incrementer
      });
      this.auto_incrementer = this.auto_incrementer + 1
      this.setState({
        markers : newMarkers,
      })
    }
  }

  deleteMarkerHandler(id) {
    var newMarkers = this.state.markers.filter(marker => marker.id !== id)
    this.setState({
      markers : newMarkers
    })
  }

  render() {
    const LeafletAnimatedCircleMarkers = this.state.markers.map(marker =>
        <AnimatedCircle 
          center={marker.position} 
          fillColor="blue" 
          key={marker.id}
          id={marker.id}
          add={this.addMarkerHandler} 
          delete = {this.deleteMarkerHandler} />
    );

    return (
      <Map 
        center={this.center} 
        zoom={this.zoom} 
        style = {{ height : '600px', width : '100%'}}>

        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {
          LeafletAnimatedCircleMarkers !== null ? LeafletAnimatedCircleMarkers 
                                                : <React.Fragment />
        }

      </Map>
    )
  }
}