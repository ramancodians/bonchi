import { registerUserAPI } from "./api";
import { useMutation } from "@tanstack/react-query";

export const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: registerUserAPI,
  });
