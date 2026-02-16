import { apiClient } from "./client";
import type { UserMeResponse } from "@/types/user";

export { type UserMeResponse };

export const getMe = async (): Promise<UserMeResponse> => {
  const { data } = await apiClient.get<UserMeResponse>("/users/me");
  return data;
};

export const updateMe = async (body: { nickname: string }): Promise<UserMeResponse> => {
  const { data } = await apiClient.put<UserMeResponse>("/users/me", body);
  return data;
};

export const updatePicture = async (file: File): Promise<void> => {
  await apiClient.patch("/users/me/picture", file, {
    params: { contentType: file.type },
    headers: { "Content-Type": file.type },
  });
};

export const deletePicture = async (): Promise<void> => {
  await apiClient.delete("/users/me/picture");
};

export const deleteMe = async (body: { reason: string }): Promise<void> => {
  await apiClient.delete("/users/me", { data: body });
};
