import { createSlice } from "@reduxjs/toolkit";

export const houseSlice = createSlice({
  name: "houses",
  initialState: {
    properties: null,
    average: 0,
    numberOfHouse: 0,
  },
  reducers: {
    propertyHandler(state, action) {
      state.properties = action.payload;
      state.numberOfHouse = action.payload.length;

      let sum = 0;
      action.payload.map((data) => (sum += data.rent));

      state.average = sum / action.payload.length;
    },
  },
});

export const propertyAction = houseSlice.actions;

export default houseSlice.reducer;
