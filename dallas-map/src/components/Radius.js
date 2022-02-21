import React from "react";
import { Slider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dallasService from "../service/dallasService";
import { propertyAction } from "../store/houseSlice";
import { coordinateAction } from "../store/coordinateSlice";

const Radius = () => {
  const marks = [
    {
      value: 0.1,
      label: '0.1'
    },
    {
      value: 0.3,
      label: '0.3'
    },
    {
      value: 0.5,
      label: '0.5'
    },
    {
      value: 1,
      label: '1'
    },
    {
      value: 1.5,
      label: '1.5'
    },
    {
      value: 2,
      label: '2'
    },
  ]

  const dispatch = useDispatch();

  const latitude = useSelector((state) => state.coordinates.lat);
  const longtitude = useSelector((state) => state.coordinates.lng);

  const valuetext = (value) => {
    return `${value} km`;
  };

  const slideValueHandler = (event, value) => {
    dispatch(coordinateAction.radiusHandler(value * 1609.34));

    dallasService.findHouses(longtitude, latitude, value * 1609.34).then(
      (response) => {
        dispatch(propertyAction.propertyHandler(response.data));
      }
    );
  };

  return (
    <div className="slidecontainer" style={{ margin: "50px", width: "500px" }}>
      <div>Set the radius (miles)</div>
      <Slider
        defaultValue={0.31}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={null}
        marks={marks}
        min={0.1}
        max={2}
        onChangeCommitted={slideValueHandler}
      />
    </div>
  );
};

export default Radius;
