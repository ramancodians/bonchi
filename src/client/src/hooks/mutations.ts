import {
  registerUserAPI,
  loginUserAPI,
  createNewSupportAPI,
  updateSupportAPI,
  createPartnerAPI,
  updatePartnerAPI,
  deletePartnerAPI,
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

// Partner Mutations
export const useCreatePartnerMutation = () =>
  useMutation({
    mutationFn: createPartnerAPI,
  });

export const useUpdatePartnerMutation = () =>
  useMutation({
    mutationFn: ({ partnerId, payload }: { partnerId: string; payload: any }) =>
      updatePartnerAPI(partnerId, payload),
  });

export const useDeletePartnerMutation = () =>
  useMutation({
    mutationFn: deletePartnerAPI,
  });
