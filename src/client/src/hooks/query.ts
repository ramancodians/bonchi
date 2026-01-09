import { useQuery } from "@tanstack/react-query";
import {
  getUserProfileAPI,
  getSupportListAPI,
  getSupportByIdAPI,
  getCustomerListAPI,
  searchCustomersAPI,

  getPartnerListAPI,
  getAgentDashboardAPI,
  getAgentWalletAPI,
  getAgentUsersAPI,
  getDMDashboardAPI,
  getDMAgentsAPI,
  getHealthCardAPI,
  getBannersAPI,
} from "./api";

export const useBanners = () =>
  useQuery({
    queryKey: ["banners"],
    queryFn: getBannersAPI,
  });

// Customer Hooks
export const useHealthCard = () => {
  return useQuery({
    queryKey: ["healthCard"],
    queryFn: getHealthCardAPI,
    retry: false,
  });
};


export const useUser = () =>
  useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfileAPI,
  });

// Support Queries
export const useSupportList = () =>
  useQuery({
    queryKey: ["supportList"],
    queryFn: getSupportListAPI,
  });

export const useSupportById = (supportId?: string) =>
  useQuery({
    queryKey: ["supportItem", supportId],
    queryFn: () => getSupportByIdAPI(supportId),
    enabled: !!supportId,
  });

// Customer/Admin Queries
export const useCustomerList = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ["customerList", page, limit],
    queryFn: () => getCustomerListAPI(page, limit),
  });

export const useCustomerSearch = (
  query: string,
  page: number = 1,
  limit: number = 10
) =>
  useQuery({
    queryKey: ["customerSearch", query, page, limit],
    queryFn: () => searchCustomersAPI(query, page, limit),
    enabled: !!query && query.length > 0,
  });

// Partner Queries
export const usePartnerList = (
  page: number = 1,
  limit: number = 10,
  role?: string,
  search?: string
) =>
  useQuery({
    queryKey: ["partnerList", page, limit, role, search],
    queryFn: () => getPartnerListAPI(page, limit, role, search),
  });

// Agent Queries
export const useAgentDashboard = () =>
  useQuery({
    queryKey: ["agentDashboard"],
    queryFn: getAgentDashboardAPI,
  });

export const useAgentWallet = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ["agentWallet", page, limit],
    queryFn: () => getAgentWalletAPI(page, limit),
  });

export const useAgentUsers = (page = 1, limit = 10, search?: string) =>
  useQuery({
    queryKey: ["agentUsers", page, limit, search],
    queryFn: () => getAgentUsersAPI(page, limit, search),
  });

// District Manager Queries
export const useDMDashboard = () =>
  useQuery({
    queryKey: ["dmDashboard"],
    queryFn: getDMDashboardAPI,
  });

export const useDMAgents = (page = 1, limit = 10, search?: string) =>
  useQuery({
    queryKey: ["dmAgents", page, limit, search],
    queryFn: () => getDMAgentsAPI(page, limit, search),
  });
