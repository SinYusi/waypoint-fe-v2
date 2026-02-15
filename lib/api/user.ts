import { apiClient } from "./client";
import type { UserMeResponse } from "@/types/user";

export { type UserMeResponse };

export const getMe = async (): Promise<UserMeResponse> => {
  const { data } = await apiClient.get<UserMeResponse>("/users/me");
  return data;
};
