import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiBanking = axios.create({
  baseURL: `${process.env.REACT_APP_TRADING_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
