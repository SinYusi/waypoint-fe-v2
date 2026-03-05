export type MemberRole = "OWNER" | "MEMBER";

interface BaseMember {
  nickname?: string;
  picture?: string;
  role?: MemberRole;
}

export interface CollectionMember extends BaseMember {
  collection_member_id: string;
}

export interface PlanMember extends BaseMember {
  plan_member_id: string;
}

export interface MembersResponse<T> {
  is_authenticated: boolean;
  me: T | null;
  members: T[];
}

export type CollectionMembersResponse = MembersResponse<CollectionMember>;
export type PlanMembersResponse = MembersResponse<PlanMember>;
