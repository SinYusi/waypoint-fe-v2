export type UserMeResponse = {
  user_id: string;
  nickname: string;
  email?: string | null;
  picture?: string | null;
  provider: "GOOGLE" | "KAKAO" | "NAVER";
};
