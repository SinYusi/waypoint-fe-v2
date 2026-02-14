import type {
  CollectionMembersResponse,
  PlanMembersResponse,
} from "@/types/member";

export const mockCollectionMembersResponse: CollectionMembersResponse = {
  is_authenticated: true,
  me: {
    collection_member_id: "cm-001",
    nickname: "나",
    picture: "https://i.pravatar.cc/150?u=cm-001",
    role: "OWNER",
  },
  members: [
    {
      collection_member_id: "cm-001",
      nickname: "나",
      picture: "https://i.pravatar.cc/150?u=cm-001",
      role: "OWNER",
    },
    {
      collection_member_id: "cm-002",
      nickname: "김민준",
      picture: "https://i.pravatar.cc/150?u=cm-002",
      role: "MEMBER",
    },
    {
      collection_member_id: "cm-003",
      nickname: "이서연",
      picture: "https://i.pravatar.cc/150?u=cm-003",
      role: "MEMBER",
    },
  ],
};

export const mockPlanMembersResponse: PlanMembersResponse = {
  is_authenticated: true,
  me: {
    plan_member_id: "pm-001",
    nickname: "나",
    picture: "https://i.pravatar.cc/150?u=pm-001",
    role: "OWNER",
  },
  members: [
    {
      plan_member_id: "pm-001",
      nickname: "나",
      picture: "https://i.pravatar.cc/150?u=pm-001",
      role: "OWNER",
    },
    {
      plan_member_id: "pm-002",
      nickname: "박지호",
      picture: "https://i.pravatar.cc/150?u=pm-002",
      role: "MEMBER",
    },
    {
      plan_member_id: "pm-003",
      nickname: "최유진",
      picture: "https://i.pravatar.cc/150?u=pm-003",
      role: "MEMBER",
    },
  ],
};
