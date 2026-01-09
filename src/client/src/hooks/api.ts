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

// Customer/Admin APIS
export const getCustomerListAPI = async (page = 1, limit = 10) =>
  (
    await axios.get(`${API_ENDPOINT}/admin/customers/list`, {
      params: { page, limit },
    })
  ).data?.data;

export const searchCustomersAPI = async (query: string, page = 1, limit = 10) =>
  (
    await axios.get(`${API_ENDPOINT}/admin/customers/search`, {
      params: { q: query, page, limit },
    })
  ).data?.data;

// Partner APIS
export const createPartnerAPI = async (payload) =>
  (await axios.post(`${API_ENDPOINT}/admin/partners/create`, payload)).data
    ?.data;

export const getPartnerListAPI = async (
  page = 1,
  limit = 10,
  role?: string,
  search?: string
) =>
  (
    await axios.get(`${API_ENDPOINT}/admin/partners/list`, {
      params: { page, limit, role, search },
    })
  ).data?.data;

export const updatePartnerAPI = async (partnerId: string, payload) =>
  (
    await axios.put(
      `${API_ENDPOINT}/admin/partners/update/${partnerId}`,
      payload
    )
  ).data?.data;

export const deletePartnerAPI = async (partnerId: string) =>
  (await axios.delete(`${API_ENDPOINT}/admin/partners/delete/${partnerId}`))
    .data?.data;
