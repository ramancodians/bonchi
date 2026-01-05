import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "./api";

export const useUser = () =>
  useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfileAPI,
  });
