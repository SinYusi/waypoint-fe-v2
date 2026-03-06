import axios from "axios";
import { apiClient } from "./client";
import type { UserMeResponse } from "@/types/user";

export { type UserMeResponse };

export const getMe = async (): Promise<UserMeResponse> => {
  const { data } = await apiClient.get<UserMeResponse>("/users/me");
  return data;
};

export const updateMe = async (body: {
  nickname: string;
}): Promise<UserMeResponse> => {
  const { data } = await apiClient.put<UserMeResponse>("/users/me", body);
  return data;
};

export const updatePicture = async (file: File): Promise<void> => {
  const { data } = await apiClient.patch<{ presigned_url: string }>(
    "/users/me/picture",
    null,
    {
      params: { contentType: file.type },
    },
  );

  await axios.put(data.presigned_url, file, {
    headers: {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const deletePicture = async (): Promise<void> => {
  await apiClient.delete("/users/me/picture");
};

export const deleteMe = async (body: { reason: string }): Promise<void> => {
  await apiClient.delete("/users/me", { data: body });
};

export type AgreeTermsResponse = {
  access_token: string;
  expires_in: number;
};

export const agreeTerms = async (): Promise<AgreeTermsResponse> => {
  const { data } = await apiClient.patch<AgreeTermsResponse>("/users/me/terms");
  return data;
};
