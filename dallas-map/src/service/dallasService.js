import axios from "axios";

class Dallasservice {
  findHouses(lng, lat, radius) {
    return axios.get(
      `https://dallas-backend.herokuapp.com/dallas/${lng}/${lat}/${radius}`
    );
  }

  // async findGeocodes(address) {
  //   axios.get(
  //     `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiaW5kZWVwOTkiLCJhIjoiY2toMmRidHg0MTU0dzJycm54YjVoMWR3ZSJ9.6ozAIR2hzVIUtEvS8tk6Wg`
  //   ).then(response => {
  //     return response.data.features[0].center
  //   });
  // }
}

export default new Dallasservice();
