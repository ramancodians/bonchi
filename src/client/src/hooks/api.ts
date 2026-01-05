import axios from "axios";
import { API_ENDPOINT } from "../config/consts";

// Auth APIS
export const registerUserAPI = async (payload) =>
  axios.post(`${API_ENDPOINT}/auth/register`, payload);
export const getUserProfileAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/auth/me`)).data?.data;
export const loginUserAPI = async (payload) =>
  axios.post(`${API_ENDPOINT}/auth/login`, payload);

// Support APIS
export const createNewSupportAPI = async (payload) =>
  (await axios.post(`${API_ENDPOINT}/support/create`, payload)).data?.data;
export const getSupportListAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/support/list`)).data?.data;
export const updateSupportAPI = async (supportId, payload) =>
  (await axios.put(`${API_ENDPOINT}/support/update/${supportId}`, payload)).data
    ?.data;
export const getSupportByIdAPI = async (supportId) =>
  (await axios.get(`${API_ENDPOINT}/support/item/${supportId}`)).data?.data;
