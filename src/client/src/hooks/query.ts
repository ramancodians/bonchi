import { useQuery } from "@tanstack/react-query";
import {
  getUserProfileAPI,
  getSupportListAPI,
  getSupportByIdAPI,
  getCustomerListAPI,
  searchCustomersAPI,
  getPartnerListAPI,
} from "./api";

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
