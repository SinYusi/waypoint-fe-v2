"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldDescription } from "@/components/ui/field-description";

const ManualAddPlacePage = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [tag, setTag] = useState("");
  const [memo, setMemo] = useState("");
  const [link, setLink] = useState("");

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
            장소 이름
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
            장소 위치
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
            장소 태그
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
            메모
          </Label>
          <Textarea
            id="memo"
            placeholder="메모를 입력해 주세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="link">링크</Label>
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
        >
          여행 계획에 추가하기
        </Button>
      </div>
    </div>
  );
};

export default ManualAddPlacePage;
