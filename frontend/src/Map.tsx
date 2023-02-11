import React from 'react';
import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { any } from 'prop-types';
import { maxHeaderSize } from 'http';

interface IProps {
  activityType: String
  minDistance: number
  startYear: number
  endYear: number
  threeD: boolean
  satellite: boolean
}

class Map extends Component<IProps> {

  // The styles available to us
  topoStyle = "/styles/topo.json"
  satelliteStyle = "/styles/satellite.json"

  // The style we start with
  currentStyle = this.topoStyle

  state = {
    loaded: false,
    style: this.currentStyle,
    viewport: {
      width: "100%",
      height: "100%",
      //latitude: -31.9505,
      //longitude: 115.8605,
      latitude: 46.6242,
      longitude: 8.0414,
      zoom: 8,
      mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_API_TOKEN ?? "mapbox-api-key-substitute-me",
    }
  };


  mapContainer: any = undefined
  map: mapboxgl.Map | undefined = undefined

  componentDidMount() {

    var mbgl : any = mapboxgl
    // eslint-disable-next-line import/no-webpack-loader-syntax
    var worker = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default
    mbgl.workerClass = worker

    var map = new mapboxgl.Map({
      container: this.mapContainer,
      center: [this.state.viewport.longitude, this.state.viewport.latitude],
      zoom: this.state.viewport.zoom,
      accessToken: this.state.viewport.mapboxApiAccessToken,
      style: this.state.style,
    })

    const component = this
    map.on('style.load', function (evt: any) {
      console.log("Loaded map")

      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      })

      map.addLayer({
        'id': 'sky',
        // @ts-ignore
        'type': 'sky',
        'paint': {
          // @ts-ignore
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 5
        }
      })
      
      component.setState({
        loaded: true
      })

    })

    map.on('styledataloading', function(event: any) {
      console.log("Style loading")
      component.setState({
        loaded: false
      })      
    })

    map.on('click', this.onClick);
    this.map = map
  }

  onClick(event: (mapboxgl.MapMouseEvent & mapboxgl.EventData)) {
    console.log(event)
    console.log("OnClick")
    // Find features in a 5px box around the clicked point
    var bbox = [
      [event.point.x - 5, event.point.y - 5],
      [event.point.x + 5, event.point.y + 5]
    ];
    // @ts-ignore
    var features = event.target.queryRenderedFeatures(bbox, {
      layers: ['activity-data']
    });

    if (features.length > 0) {
      const feature = features[0];
      if (feature.layer.id === 'activity-data') {
        // @ts-ignore
        var url = 'https://www.strava.com/activities/' + feature.properties.id;
        window.open(url, '_blank');
      }
    }
  }

  render() {
    console.log("Render")
    console.log("this.map =" + this.map)
    if (this.map != undefined && this.state.loaded) {
      this.map.setFilter("activity-data", null)
      const filter = [
        "all",
        ["match", ["get", "activity_type"], [this.props.activityType], true, false],
        [">", ["get", "distance_meters"], this.props.minDistance],
        [">=", ["get", "start_date"], "" + this.props.startYear],
        ["<=", ["get", "start_date"], "" + this.props.endYear + 1]
      ]

      // Cheap and cheerful! Remove the activity_type constraint if activityType == 'All'
      if (this.props.activityType === "All") {
        filter.splice(1, 1)
      }

      // Set the filter
      this.map.setFilter("activity-data", filter)

      // Terrain - on or off?
      if (this.props.threeD) {
        console.log("3d on")
        this.map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.2 })
      }
      else {
        console.log("3d off")
        this.map.setTerrain(null);
      }

      // Satellite - on or off?
      const desiredStyle = this.props.satellite? this.satelliteStyle : this.topoStyle
      if (desiredStyle != this.currentStyle) {
        console.log("Set style to " + desiredStyle)
        this.currentStyle = desiredStyle
        this.map.setStyle(desiredStyle);
      }
      //this.map.setLayoutProperty('mapbox-satellite', 'visibility', this.props.satellite? 'visible' : 'none' )
    }

    return (
      <div id="mapContainer" ref={el => this.mapContainer = el} />
    );

  }
}

export default Map