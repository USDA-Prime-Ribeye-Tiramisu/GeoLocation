import React from "react";
import { Slider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dallasService from "../service/dallasService";
import { propertyAction } from "../store/houseSlice";
import { coordinateAction } from "../store/coordinateSlice";

const Radius = () => {
  const dispatch = useDispatch();

  const latitude = useSelector((state) => state.coordinates.lat);
  const longtitude = useSelector((state) => state.coordinates.lng);

  const valuetext = (value) => {
    return `${value} km`;
  };

  const slideValueHandler = (event, value) => {
    dispatch(coordinateAction.radiusHandler(value * 1000));

    dallasService.findHouses(longtitude, latitude, value * 1000).then(
      (response) => {
        dispatch(propertyAction.propertyHandler(response.data));
      }
    );
  };

  return (
    <div className="slidecontainer" style={{ margin: "50px", width: "500px" }}>
      <div>Set the radius (km)</div>
      <Slider
        defaultValue={0.5}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={0.25}
        marks
        min={0.5}
        max={2}
        onChangeCommitted={slideValueHandler}
      />
    </div>
  );
};

export default Radius;
