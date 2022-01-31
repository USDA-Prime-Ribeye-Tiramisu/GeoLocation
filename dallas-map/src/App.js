import "./App.css";
import MyMap from "./components/MyMap";
import Radius from "./components/Radius";
import HouseTable from "./components/HouseTable";
import { Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const App = () => {
  return (
    <div className="App">
      <h1>Check for rental properties in Dallas</h1>
      <Grid container spacing={1} >
        <Grid item={true} xs={8} align="center">
          <Item>
            <MyMap />
          </Item>
          <Radius />
        </Grid>
        <Grid item={true} xs={4} align="center">
          <HouseTable />
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
