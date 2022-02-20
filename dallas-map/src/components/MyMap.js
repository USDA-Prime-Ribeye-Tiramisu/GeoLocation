import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapCircle from "./MapCircle";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../store/houseSlice";
import { coordinateAction } from "../store/coordinateSlice";
import { circle, ellipse } from "@turf/turf";
import Dallasservice from "../service/dallasService";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { any, string } from "joi";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaW5kZWVwOTkiLCJhIjoiY2toMmRidHg0MTU0dzJycm54YjVoMWR3ZSJ9.6ozAIR2hzVIUtEvS8tk6Wg";

const MyMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const foundMarker = useRef(null);
  const [lng, setLng] = useState(-97.03985);
  const [lat, setLat] = useState(32.92495);
  const [zoom, setZoom] = useState(15);

  const [coordinate, setCoordinate] = useState(null);

  const [markers, setMarkers] = useState([]);

  const dispatch = useDispatch();
  const averageRent = useSelector((state) => state.houses.average);
  const numberOfHouse = useSelector((state) => state.houses.numberOfHouse);
  const radius = useSelector((state) => state.coordinates.radius);
  const latitude = useSelector((state) => state.coordinates.lat);
  const longtitude = useSelector((state) => state.coordinates.lng);
  const propertySelector = useSelector((state) => state.houses.properties);

  useEffect(() => {
    if (coordinate != null) {
      if (
        map.current.getLayer("circle-fill") &&
        map.current.getSource("circleInfo")
      ) {
        map.current.removeLayer("circle-fill");
        map.current.removeSource("circleInfo");
      }

      let popContent = "";

      if (numberOfHouse > 1) {
        popContent = "Average Rent: $" + averageRent.toFixed();
      } else {
        popContent =
          "There are not enough properties to calculate a meaningful average";
      }

      for (let i = markers.length - 1; i >= 0; i--) {
        markers[i].remove();
      }

      if (propertySelector != null) {
        propertySelector.map((data, index) => {
          var el = document.createElement("div");
          el.style.backgroundColor = "black";
          el.style.width = "30px";
          el.style.height = "30px";
          el.style.borderRadius = "50%";

          let currentMarkers = new mapboxgl.Marker(el)
            .setLngLat(data.geometry.coordinates)
            .addTo(map.current);

          setMarkers((oldArray) => [...oldArray, currentMarkers]);
        });
      }

      marker.current.setLngLat(coordinate).addTo(map.current);
      marker.current.setPopup(
        new mapboxgl.Popup({
          closeOnClick: false,
          closeButton: false,
          offset: 100,
        }).setHTML(popContent)
      );
      marker.current.togglePopup();

      const center = [longtitude, latitude];
      const options = {
        units: "kilometers",
      };

      const drawCircle = circle(center, radius / 1000, options);

      map.current.addSource("circleInfo", {
        type: "geojson",
        data: drawCircle,
      });

      map.current.addLayer({
        id: "circle-fill",
        type: "fill",
        source: "circleInfo",
        paint: {
          "fill-color": "yellow",
          "fill-opacity": 0.2,
        },
      });

      Dallasservice.findHouses(longtitude, latitude, radius).then(
        (response) => {
          dispatch(propertyAction.propertyHandler(response.data));
        }
      );
    }

    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    marker.current = new mapboxgl.Marker();
    map.current.on("click", function add_marker(event) {
      var coordinates = event.lngLat;
      setCoordinate(coordinates);
      dispatch(coordinateAction.latHandler(coordinates.lat));
      dispatch(coordinateAction.lngHandler(coordinates.lng));
    });
  }, [
    coordinate,
    averageRent,
    dispatch,
    lat,
    latitude,
    lng,
    longtitude,
    numberOfHouse,
    radius,
    zoom,
  ]);

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
