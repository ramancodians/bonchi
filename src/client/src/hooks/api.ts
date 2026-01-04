import axios from "axios";
import { API_ENDPOINT } from "../config/consts";

// Auth APIS
export const registerUserAPI = async (payload) =>
  axios.post(`${API_ENDPOINT}/auth/register`, payload);
