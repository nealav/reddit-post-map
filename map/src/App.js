// Ref :
// https://blog.cloudboost.io/adding-custom-maps-to-react-app-using-mapbox-bb978845e7ad
// https://blog.webkid.io/making-maps-with-react/
// https://github.com/wbkd/making-maps-with-react/blob/master/src/components/ReactLeaflet/index.js
// https://react-leaflet.js.org/docs/en/examples.html

import React, { Component } from 'react';
import './assets/css/App.css'
//import Map from './components/Map'
//import AnimatedMap from './components/AnimatedMap'
import AnimatedCircleMap from './components/AnimatedCircleMap'

class App extends Component {
  render() {
    return (
      <AnimatedCircleMap />
    );
  }
}

export default App;
