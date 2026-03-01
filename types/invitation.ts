export type InvitationResponse = {
  type: "PLAN" | "COLLECTION";
  reference_id: string;
  url: string;
  ttl: string;
};
