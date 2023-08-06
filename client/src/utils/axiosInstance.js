import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.REACT_APP_SERVER_PATH,
});

export default instance;
