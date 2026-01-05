import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI, getSupportListAPI, getSupportByIdAPI } from "./api";

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
