"use client";

import ProfileImage from "@/components/common/ProfileImage";
import { useMe } from "@/lib/hooks/use-me";

const EditMyInformationPage = () => {
  const { data: me } = useMe();

  const nickname = me?.nickname ?? "";
  const picture = me?.picture ?? "";

};

export default EditMyInformationPage;
