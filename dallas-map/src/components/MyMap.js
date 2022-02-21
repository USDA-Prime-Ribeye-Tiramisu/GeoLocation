import React, { useRef, useEffect, useState } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import MapCircle from "./MapCircle";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../store/houseSlice";
import { coordinateAction } from "../store/coordinateSlice";
import { circle } from "@turf/turf";
import Dallasservice from "../service/dallasService";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

const zoomLevelToChangeBasemap = 16.5;

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3hieGNoZW4iLCJhIjoiYjRhNWMyMmI0NzVjZjEzZjYyZGUzZDM0NmFhZTcyNjEifQ.-T2S1ZeAEBGxjC4rC0CZzA";

const MyMap = () => {
  const mapContainer = useRef(null);
  const mapCMA = useRef(null);
  const marker = useRef(null);
  // const foundMarker = useRef(null);
  const [lng, setLng] = useState(-97.03985);
  const [lat, setLat] = useState(32.92495);
  // const [zoom, setZoom] = useState(15);

  const [coordinate, setCoordinate] = useState(null);

  const [markers, setMarkers] = useState([]);

  const dispatch = useDispatch();
  const averageRent = useSelector((state) => state.houses.average);
  const numberOfHouse = useSelector((state) => state.houses.numberOfHouse);
  const radius = useSelector((state) => state.coordinates.radius);
  // const latitude = useSelector((state) => state.coordinates.lat);
  // const longtitude = useSelector((state) => state.coordinates.lng);
  // const propertySelector = useSelector((state) => state.houses.properties);

  // Initialize map
  useEffect(() => {
    if (mapCMA.current) return; // initialize map only once
    mapCMA.current = new mapboxgl.Map({
      container: mapContainer.current,
      minZoom: 0,
      maxZoom: 22,
      hash: false,
      style: "mapbox://styles/sxbxchen/ckzujatkn000h15qm0ka5son1",
      center: [lng, lat],
      zoom: 10.39787299330436,
    });

  });

  // Add layers, set layer properties, add listeners, etc
  // When map finished loading
  useEffect(() => {
    if (!mapCMA.current) return; // wait for map to initialize

    // when map is loaded
    mapCMA.current.on('load', function() {
      mapCMA.current.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('el-school-a7rubi', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('middel-school-4pqrje', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('high-school-dh4tbn', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('new-hospital-6pzitx', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('existing-hospital-70u8wv', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('dfw-all-79w3xj', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('other-school-73r1ci', 'visibility', 'none');
      mapCMA.current.scrollZoom.setWheelZoomRate(1/200);
      mapCMA.current.scrollZoom.setZoomRate(1/50);

      // copy the parcel point layer and set style using symbol to show house price
      mapCMA.current.addLayer({
        'id': 'Parcel Point Price',
        'type': 'symbol',
        "source": "composite",
        "source-layer": "Dallas_Parcel_Points",
        'minzoom': zoomLevelToChangeBasemap,
        'layout': {
          'visibility': 'none',
          // 'icon-image': "rectangle-white-6",
          // 'icon-text-fit': 'both',
          // 'icon-text-fit-padding': [2, 6, 2, 6],
          // 'text-field': '${house}',
          'text-field': [
            'case',
            // if house > 999999 after conversion...
            ['>', ["to-number", ['get', 'house']], 999999],
            // ... here's the output:
            ['concat', ['number-format', ['/', ["to-number", ['get', 'house']], 1000000], { 'min-fraction-digits': 0, 'max-fraction-digits': 2 }], 'M'],
            // else if 999499 < house < 999999...
            ['all', ['>', ["to-number", ['get', 'house']], 999499], ['<', ["to-number", ['get', 'house']], 1000000]],
            //... here's the output:
            '1M',
            // else if list price <= 999999, here's the output
            ['concat', ['round', ['/', ["to-number", ['get', 'house']], 1000]], 'K'],
          ],
          // 'text-variable-anchor': ['top'],
          'text-variable-anchor': ['center'],
          'text-justify': 'center',
          'text-radial-offset': 1,
          // 'text-offset': [0, 1],
          // 'text-justify': 'auto',
          // On how to use custom fonts in Mapbox, see: https://github.com/mapbox/mapbox-gl-js/issues/6666
          'text-font': [
            "Source Sans Pro Bold",
            "Open Sans Bold" // fallback font
          ],
          // 'text-size': 12,
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            zoomLevelToChangeBasemap, 15,
            22, 20,
          ],
          'icon-allow-overlap': true,
          'text-allow-overlap': true,
          // 'icon-ignore-placement': true,
          // 'text-ignore-placement': true,
        },
        'paint': {
          'text-color': '#fff',
          'text-halo-color': '#000',
          'text-halo-width': 20, // use halo instead of an icon for text background
          // 'background-color': "#000"
        },
      });

      // set parcel boundary layer paint properties
      mapCMA.current.setPaintProperty('Parcel Boundary', 'line-width', 2);
      mapCMA.current.setPaintProperty('Parcel Boundary', 'line-color', 
        [
          "case",
            ["boolean", ["feature-state", "selected"], false],
          "#0099ff",
          "#e6ffff"
        ]
      );

      // add listeners
      mapCMA.current.on('zoomend', changeVisibilityBasemapAndParcel);
    });
  });



  useEffect(() => {
    // if (coordinate != null) {
    //   if (
    //     mapCMA.current.getLayer("circle-fill") &&
    //     mapCMA.current.getSource("circleInfo")
    //   ) {
    //     mapCMA.current.removeLayer("circle-fill");
    //     mapCMA.current.removeSource("circleInfo");
    //   }

    //   let popContent = "";

    //   if (numberOfHouse > 1) {
    //     popContent = "Average Rent: $" + averageRent.toFixed();
    //   } else {
    //     popContent =
    //       "There are not enough properties to calculate a meaningful average";
    //   }

    //   for (let i = markers.length - 1; i >= 0; i--) {
    //     markers[i].remove();
    //   }

    //   if (propertySelector != null) {
    //     propertySelector.map((data, index) => {
    //       var el = document.createElement("div");
    //       el.style.backgroundColor = "#1c73ff";
    //       el.style.width = "10px";
    //       el.style.height = "10px";
    //       el.style.borderRadius = "50%";

    //       let currentMarkers = new mapboxgl.Marker(el)
    //         .setLngLat(data.geometry.coordinates)
    //         .addTo(mapCMA.current);

    //       setMarkers((oldArray) => [...oldArray, currentMarkers]);
    //     });
    //   }

    //   marker.current.setLngLat(coordinate).addTo(mapCMA.current);
    //   marker.current.setPopup(
    //     new mapboxgl.Popup({
    //       closeOnClick: false,
    //       closeButton: false,
    //       offset: 100,
    //     }).setHTML(popContent)
    //   );
    //   marker.current.togglePopup();

    //   const center = [longtitude, latitude];
    //   const options = {
    //     units: "kilometers",
    //   };

    //   const drawCircle = circle(center, radius / 1000, options);

    //   mapCMA.current.addSource("circleInfo", {
    //     type: "geojson",
    //     data: drawCircle,
    //   });

    //   mapCMA.current.addLayer({
    //     id: "circle-fill",
    //     type: "fill",
    //     source: "circleInfo",
    //     paint: {
    //       "fill-color": "yellow",
    //       "fill-opacity": 0.2,
    //     },
    //   });

    //   Dallasservice.findHouses(longtitude, latitude, radius).then(
    //     (response) => {
    //       dispatch(propertyAction.propertyHandler(response.data));
    //     }
    //   );
    // }

    

    marker.current = new mapboxgl.Marker();
    mapCMA.current.on("click", function add_marker(event) {
      // setMarkers(null);
      var coordinates = event.lngLat;
      setCoordinate(coordinates);
      dispatch(coordinateAction.latHandler(coordinates.lat));
      dispatch(coordinateAction.lngHandler(coordinates.lng));

      // query database
      Dallasservice.findHouses(coordinates.lng, coordinates.lat, radius).then(
        (response) => {
          dispatch(propertyAction.propertyHandler(response.data));
          console.log('response', response);
          // generate marker
          for (let i = markers.length - 1; i >= 0; i--) {
            markers[i].remove();
          }

          if (response.length > 0) {
            let rentSum = 0;
            response.data.map((property, index) => {
              var el = document.createElement("div");
              el.style.backgroundColor = "#1c73ff";
              el.style.width = "10px";
              el.style.height = "10px";
              el.style.borderRadius = "50%";

              let currentMarkers = new mapboxgl.Marker(el)
                .setLngLat(property.geometry.coordinates)
                .addTo(mapCMA.current);

              setMarkers((oldArray) => [...oldArray, currentMarkers]);

              rentSum = +property.rent;
            });
            // generate popup
            let popContent = "";

            if (response.data.length > 1) {
              
              popContent = "Average Rent: $" + (rentSum/response.data.length).toFixed();
            } else {
              popContent =
                "There are not enough properties to calculate a meaningful average";
            }
            
            marker.current.setPopup(
              new mapboxgl.Popup({
                closeOnClick: false,
                closeButton: false,
                offset: 100,
              }).setHTML(popContent)
            );

            marker.current.setLngLat(coordinates).addTo(mapCMA.current);
            marker.current.togglePopup();
          }
        }
      );

      // generate circle
      // remove previous circle if needed
      if (
        mapCMA.current.getLayer("circle-fill") &&
        mapCMA.current.getSource("circleInfo")
      ) {
        mapCMA.current.removeLayer("circle-fill");
        mapCMA.current.removeSource("circleInfo");
      }

      const center = [coordinates.lng, coordinates.lat];
      const options = {
        units: "kilometers",
      };

      const drawCircle = circle(center, radius / 1000, options);

      mapCMA.current.addSource("circleInfo", {
        type: "geojson",
        data: drawCircle,
      });

      mapCMA.current.addLayer({
        id: "circle-fill",
        type: "fill",
        source: "circleInfo",
        paint: {
          "fill-color": "yellow",
          "fill-opacity": 0.2,
        },
      });

      const nationalProvidersFeatures = mapCMA.current.queryRenderedFeatures({
        layers: ['National SFR Funds'],
        // filter: ['within', drawCircle]
      });
      console.log('nationalProvidersFeatures', nationalProvidersFeatures);
    });
  }, [
    // coordinate,
    // propertySelector,
    averageRent,
    dispatch,
    // lat,
    // latitude,
    // lng,
    // longtitude,
    numberOfHouse,
    radius,
    // zoom,
  ]);

  
  // change basemap to satellite image, hide block layer, and show parcel line, fill and point when zoomed in and when loading map
  const changeVisibilityBasemapAndParcel = () => {
    if (mapCMA.current.getZoom() >= zoomLevelToChangeBasemap) {
      // show parcel
      mapCMA.current.setLayoutProperty('Parcel Point Price', 'visibility', 'visible');
      mapCMA.current.setLayoutProperty('Parcel Boundary', 'visibility', 'visible');
      mapCMA.current.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
    } else {
      // hide parcel
      mapCMA.current.setLayoutProperty('Parcel Point Price', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('Parcel Boundary', 'visibility', 'none');
      mapCMA.current.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
    }
  };

  // const position = [32.92495, -97.03985];

  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "600px" }}
      />
    </div>

    // <MapContainer
    //   className="map"
    //   center={position}
    //   zoom={15}
    //   style={{ height: 600, width: "100%" }}
    // >
    //   <TileLayer
    //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //   />
    //   <MapCircle />
    // </MapContainer>
  );
};

export default MyMap;
