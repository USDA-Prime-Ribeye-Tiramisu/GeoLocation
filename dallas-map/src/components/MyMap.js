import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapCircle from "./MapCircle";
import { useSelector } from "react-redux";

const MyMap = () => {
  const position = [32.92495, -97.03985];
  const radius = useSelector((state) => state.coordinates.radius);

  return (
    <MapContainer
      className="map"
      center={position}
      zoom={15}
      style={{ height: 600, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCircle radius={radius} />
    </MapContainer>
  );
};

export default MyMap;
