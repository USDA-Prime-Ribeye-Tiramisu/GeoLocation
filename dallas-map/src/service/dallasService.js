import axios from "axios";

class DallasService {
  findHouses(lng, lat, radius) {
    return axios.get(`http://localhost:8080/dallas/${lng}/${lat}/${radius}`);
  }
}

export default new DallasService();
