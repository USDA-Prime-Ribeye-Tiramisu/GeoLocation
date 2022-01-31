import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MyMap from './components/MyMap';
import Radius from './components/Radius';
import HouseTable from './components/HouseTable';

const App = () => {
  return (
    <div className="App">
      <MyMap/>
      <Radius/>
      <HouseTable/>
    </div>
  );
}

export default App;
