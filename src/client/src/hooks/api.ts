import axios from "axios";
import { API_ENDPOINT } from "../config/consts";
// import { API_ENDPOINT } from "../config/consts";

// Auth APIS
export const registerUserAPI = async (payload) =>
  axios.post(`${API_ENDPOINT}/auth/register`, payload);
export const getUserProfileAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/auth/me`)).data?.data || null;
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

export const getCustomerProfileAPI = async (customerId: string) =>
  (await axios.get(`${API_ENDPOINT}/admin/customers/${customerId}`)).data?.data;

export const getAdminStatsAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/admin/stats`)).data?.data;

// Partner APIS
export const createPartnerAPI = async (payload) => {
  let endpoint = `${API_ENDPOINT}/admin/partners/create`;

  if (payload.role === "BONCHI_MITRA") {
    endpoint = `${API_ENDPOINT}/admin/bonchi-mitra/create`;
  } else if (payload.role === "DISTRICT_CORDINATOR") {
    endpoint = `${API_ENDPOINT}/admin/district-coordinators/create`;
  }

  return (await axios.post(endpoint, payload)).data?.data;
};

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

// Agent APIS
export const getAgentDashboardAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/agent/dashboard`)).data?.data;

export const getAgentWalletAPI = async (page = 1, limit = 20) =>
  (await axios.get(`${API_ENDPOINT}/agent/wallet`, { params: { page, limit } }))
    .data?.data;

export const createAgentUserAPI = async (payload) =>
  (await axios.post(`${API_ENDPOINT}/agent/create-user`, payload)).data?.data;

export const getAgentUsersAPI = async (page = 1, limit = 10, search?: string) =>
  (
    await axios.get(`${API_ENDPOINT}/agent/users`, {
      params: { page, limit, search },
    })
  ).data?.data;

// District Manager APIS
export const getDMDashboardAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/district-manager/dashboard`)).data?.data;

export const getDMAgentsAPI = async (page = 1, limit = 10, search?: string) =>
  (
    await axios.get(`${API_ENDPOINT}/district-manager/agents`, {
      params: { page, limit, search },
    })
  ).data?.data;

export const createDMAgentAPI = async (payload) =>
  (await axios.post(`${API_ENDPOINT}/district-manager/create-agent`, payload))
    .data?.data;

export const dmWalletActionAPI = async ({ agentId, ...payload }) =>
  (
    await axios.post(
      `${API_ENDPOINT}/district-manager/agent/${agentId}/wallet-action`,
      payload
    )
  ).data;

export const dmAgentStatusAPI = async ({ agentId, status }) =>
  (
    await axios.post(
      `${API_ENDPOINT}/district-manager/agent/${agentId}/status`,
      { status }
    )
  ).data;

export const deletePartnerAPI = async (partnerId: string) =>
  (await axios.delete(`${API_ENDPOINT}/admin/partners/delete/${partnerId}`))
    .data?.data;

// Customer Health Card APIS
export const getHealthCardAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/customer/health-card`)).data?.data;

export const getPaymentConfigAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/customer/health-card/config`)).data?.data;

export const activateHealthCardAPI = async (payload) =>
  (await axios.post(`${API_ENDPOINT}/customer/health-card/activate`, payload))
    .data;

export const getBannersAPI = async () =>
  (await axios.get(`${API_ENDPOINT}/banners/public`)).data?.data;

// Listings APIS
export const getListingsAPI = async (
  page = 1,
  limit = 10,
  type?: "HOSPITAL" | "LAB" | "MEDICAL_STORE",
  search?: string
) =>
  (
    await axios.get(`${API_ENDPOINT}/listings`, {
      params: { page, limit, type, search },
    })
  ).data?.data;
