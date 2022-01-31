import React, { useState } from "react";
import { useMapEvents, Circle, Tooltip, Marker } from "react-leaflet";
import L from "leaflet";
import Dallasservice from "../service/dallasService";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../store/houseSlice";
import { coordinateAction } from "../store/coordinateSlice";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapCircle = () => {
  const dispatch = useDispatch();
  const averageRent = useSelector((state) => state.houses.average);
  const numberOfHouse = useSelector((state) => state.houses.numberOfHouse);
  const radius = useSelector((state) => state.coordinates.radius);
  const [markers, setMarkers] = useState();

  useMapEvents({
    click(e) {
      dispatch(coordinateAction.latHandler(e.latlng.lat));
      dispatch(coordinateAction.lngHandler(e.latlng.lng));
      Dallasservice.findHouses(e.latlng.lng, e.latlng.lat, radius).then(
        (response) => {
          dispatch(propertyAction.propertyHandler(response.data));
        }
      );
      const newMarker = e.latlng;
      setMarkers(newMarker);
    },
  });

  return (
    <>
      {markers && (
        <Circle center={markers} radius={radius}>
          <Marker position={markers}></Marker>
          {numberOfHouse > 1 ? (
            <Tooltip permanent direction="top" offset={[0, markers.lng - 20]}>
              Average Rent: ${averageRent.toFixed()}
            </Tooltip>
          ) : (
            <Tooltip permanent direction="top" offset={[0, markers.lng - 20]}>
              There are not enough properties to calculate a meaningful average
            </Tooltip>
          )}
        </Circle>
      )}
    </>
  );
};

export default MapCircle;
