import {
  registerUserAPI,
  loginUserAPI,
  createNewSupportAPI,
  updateSupportAPI,
} from "./api";
import { useMutation } from "@tanstack/react-query";

export const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: registerUserAPI,
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: loginUserAPI,
  });

// Support Mutations
export const useCreateSupportMutation = () =>
  useMutation({
    mutationFn: createNewSupportAPI,
  });

export const useUpdateSupportMutation = () =>
  useMutation({
    mutationFn: ({ supportId, payload }: { supportId: string; payload: any }) =>
      updateSupportAPI(supportId, payload),
  });
