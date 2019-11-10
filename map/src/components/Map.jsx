import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const CENTER = [37.338207, -121.886330];
const ZOOM = 8;

let MARKERS = [];
MARKERS.push({
  name : 'San Jose',
  position : [37.338207, -121.886330]
});
MARKERS.push({
  name : 'San Francisco',
  position : [37.774929, -122.419418]
});
MARKERS.push({
  name : 'Palo Alto',
  position : [37.445100, -122.160360]
});
MARKERS.push({
  name : 'Stanford',
  position : [37.427475, -122.169716]
});

export default class ReactMap extends Component {
    constructor() {
      super();

      this.state = {
        center : CENTER, 
        zoom : ZOOM,
        markers : MARKERS
      };
    }
  
    render() {

      const LeafletMarkers = this.state.markers.map(marker => (
        <Marker position={marker.position} key={marker.name}>
          <Popup>
            <span>{marker.name}</span>  
          </Popup> 
        </Marker> 
      ));

      return (
        <Map style = {{ height : '600px', width : '100%'}}
             center={CENTER} 
             zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {LeafletMarkers}
        </Map>
      );
    }
}
