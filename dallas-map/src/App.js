import "./App.css";
import Mymap from "./components/Mymap";
import Radius from "./components/Radius";
import Housetable from "./components/Housetable";
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
            <Mymap />
          </Item>
          <Radius />
        </Grid>
        <Grid item={true} xs={4} align="center">
          <Housetable />
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
