"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldDescription } from "@/components/ui/field-description";
import { useParams, useRouter } from "next/navigation";

const ManualAddPlacePage = () => {
  const router = useRouter();
  const params = useParams<{ planId: string | string[] }>();
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [tag, setTag] = useState("");
  const [memo, setMemo] = useState("");
  const [link, setLink] = useState("");

  const handleAddToPlan = () => {
    if (!planId) return;
    window.sessionStorage.setItem(
      "project:selected-manual-place",
      JSON.stringify({
        name: name.trim(),
        address: location.trim(),
        tag: tag.trim(),
        memo: memo.trim(),
        google_maps_uri: link.trim(),
      }),
    );
    router.push(`/projects/${planId}/place-add?source=manual`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        showBackButton
        leftBtnBgVariant="ghost"
        variant="center"
        title="직접 입력"
        className="fixed top-0 z-10 bg-white"
      />
      <div className="mt-15 flex flex-col gap-5 overflow-y-auto px-5 pt-7 pb-20">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" required>
            <span className="typography-label-sm-sb text-foreground">장소 이름</span>
          </Label>
          <InputForm
            id="name"
            hideIcon
            placeholder="장소 이름을 입력해 주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location" required>
            <span className="typography-label-sm-sb text-foreground">장소 위치</span>
          </Label>
          <InputForm
            id="location"
            hideIcon
            placeholder="장소 위치를 입력해 주세요"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tag" required>
            <span className="typography-label-sm-sb text-foreground">장소 태그</span>
          </Label>
          <InputForm
            id="tag"
            hideIcon
            placeholder="장소 태그를 입력해 주세요"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="memo" required>
            <span className="typography-label-sm-sb text-foreground">메모</span>
          </Label>
          <Textarea
            id="memo"
            placeholder="메모를 입력해 주세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="link">
            <span className="typography-label-sm-sb text-foreground">링크</span>
          </Label>
          <InputForm
            id="link"
            hideIcon
            placeholder="링크를 입력해 주세요"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <FieldDescription>
            장소와 관련된 콘텐츠 링크를 첨부할 수 있어요
          </FieldDescription>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white px-5 py-4">
        <Button
          className="w-full bg-primary typography-action-base-bold disabled:opacity-40"
          disabled={!name.trim() || !location.trim() || !tag.trim() || !memo.trim()}
          onClick={handleAddToPlan}
        >
          여행 계획에 추가하기
        </Button>
      </div>
    </div>
  );
};

export default ManualAddPlacePage;
