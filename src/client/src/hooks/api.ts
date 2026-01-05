import axios from "axios";
import { API_ENDPOINT } from "../config/consts";

// Auth APIS
export const registerUserAPI = async (payload) =>
  axios.post(`${API_ENDPOINT}/auth/register`, payload);
export const getUserProfileAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/auth/me`)).data?.data;
export const loginUserAPI = async (payload) =>
  axios.post(`${API_ENDPOINT}/auth/login`, payload);
