import { createSlice } from "@reduxjs/toolkit";

export const coordinatesSlice = createSlice({
  name: "coordinates",
  initialState: {
    lng: 0,
    lat: 0,
    radius: 500,
  },
  reducers: {
    lngHandler(state, action) {
      state.lng = action.payload;
    },
    latHandler(state, action) {
      state.lat = action.payload;
    },
    radiusHandler(state, action) {
      state.radius = action.payload;
    },
  },
});

export const coordinateAction = coordinatesSlice.actions;

export default coordinatesSlice.reducer;
