import { configureStore } from "@reduxjs/toolkit";
import houseReducer from "./houseSlice";
import coordinatesReducer from "./coordinateSlice";

const store = configureStore({
  reducer: {
    houses: houseReducer,
    coordinates: coordinatesReducer,
  },
});

export default store;
