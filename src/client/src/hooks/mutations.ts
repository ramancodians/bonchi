import { registerUserAPI, loginUserAPI } from "./api";
import { useMutation } from "@tanstack/react-query";

export const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: registerUserAPI,
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: loginUserAPI,
  });
