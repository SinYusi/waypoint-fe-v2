"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";

type Case = {
  label: string;
  desc: string;
  props: Partial<React.ComponentProps<typeof BottomSheet>>;
};

const CASES: Case[] = [
  {
    label: "취소만 (cancelVariant=outline, 기본)",
    desc: "showDivider=true, closeOnCancel=true",
    props: {
      cancelLabel: "취소",
      cancelVariant: "outline",
    },
  },
  {
    label: "cancelVariant=default",
    desc: "취소 버튼이 primary(파란) 스타일",
    props: {
      cancelLabel: "닫기",
      cancelVariant: "default",
    },
  },
  {
    label: "취소 + 확인 버튼",
    desc: "confirmLabel 추가",
    props: {
      cancelLabel: "취소",
      confirmLabel: "확인",
    },
  },
  {
    label: "confirmDisabled=true",
    desc: "확인 버튼 비활성화",
    props: {
      cancelLabel: "취소",
      confirmLabel: "확인",
      confirmDisabled: true,
    },
  },
  {
    label: "showDivider=false",
    desc: "콘텐츠-버튼 구분선 숨김",
    props: {
      cancelLabel: "취소",
      confirmLabel: "확인",
      showDivider: false,
    },
  },
  {
    label: "showBottomGradient=true",
    desc: "콘텐츠 하단 fade-out 그라디언트",
    props: {
      cancelLabel: "취소",
      showBottomGradient: true,
      content: (
        <div className="flex flex-col gap-2 pb-4">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="h-10 rounded-lg bg-muted px-4 py-2 typography-body-sm-reg text-muted-foreground">
              스크롤 아이템 {i + 1}
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    label: "items 목록",
    desc: "items prop으로 메뉴 목록 표시",
    props: {
      cancelLabel: "취소",
      items: [
        { id: "1", label: "항목 1", onSelect: () => {} },
        { id: "2", label: "항목 2", onSelect: () => {} },
        { id: "3", label: "항목 3", disabled: true },
      ],
    },
  },
  {
    label: "closeOnCancel=false",
    desc: "취소 클릭 시 자동 닫힘 없음 (onCancel만 호출)",
    props: {
      cancelLabel: "취소 (닫히지 않음)",
      closeOnCancel: false,
      onCancel: () => alert("onCancel 콜백 호출됨"),
    },
  },
];

export default function BottomSheetPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {CASES.map((c, i) => (
        <div key={i} className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
          <p className="typography-label-base-sb">{c.label}</p>
          <p className="mb-3 typography-body-sm-reg text-muted-foreground">{c.desc}</p>
          <Button size="S" variant="outline" onClick={() => setOpenIndex(i)} className="w-fit rounded-full px-4">
            열기
          </Button>
          <BottomSheet
            open={openIndex === i}
            onOpenChange={(v) => setOpenIndex(v ? i : null)}
            title={c.label}
            {...c.props}
          />
        </div>
      ))}
    </div>
  );
}
