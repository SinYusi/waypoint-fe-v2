"use client";

import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import { validatePlanTitle } from "@/lib/utils/validate-plan-title";
import {
  formatDateRangeText,
  getToday,
  isSameDateRange,
} from "@/lib/utils/date";

type UseProjectFormParams = {
  initialTitle?: string;
  initialRange?: DateRange;
  dateTextPattern?: string;
};

export const useProjectForm = ({
  initialTitle = "",
  initialRange,
  dateTextPattern = "yyyy.MM.dd",
}: UseProjectFormParams = {}) => {
  // 초기값(비교 기준)
  const [initial] = useState<{ title: string; range?: DateRange }>({
    title: initialTitle,
    range: initialRange,
  });

  // values
  const [title, setTitle] = useState(initialTitle);
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  // errors
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");

  // calendar ui
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    initialRange?.from ?? getToday(),
  );
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(
    initialRange,
  );

  const dateText = formatDateRangeText(range, dateTextPattern, " ~ ", ko);

  // 변경 여부(버튼 활성화 기준)
  const isChange = useMemo(() => {
    const titleChanged = title.trim() !== initial.title.trim();
    const rangeChanged = !isSameDateRange(range, initial.range);
    return titleChanged || rangeChanged;
  }, [title, range, initial]);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (titleErrorMessage) setTitleErrorMessage("");
  };

  const validateTitleOnBlur = () => {
    const v = validatePlanTitle(title);
    if (!v.ok) setTitleErrorMessage(v.message);
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
    setDraftRange(range);
    setCalendarMonth(range?.from ?? getToday());
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    setDraftRange(range);
  };

  const onCalendarOpenChange = (open: boolean) => {
    if (open) openCalendar();
    else closeCalendar();
  };

  const completeCalendar = () => {
    if (!draftRange?.from || !draftRange?.to) return;

    setRange(draftRange);
    setCalendarMonth(draftRange.from);
    setDateErrorMessage("");
    setIsCalendarOpen(false);
  };

  /** 제출 전 최종 검증 */
  const validateForSubmit = () => {
    const v = validatePlanTitle(title);
    if (!v.ok) {
      setTitleErrorMessage(v.message);
      return { ok: false as const };
    }

    if (!range?.from || !range?.to) {
      setDateErrorMessage("여행 시작일과 종료일을 선택해 주세요.");
      return { ok: false as const };
    }

    setTitleErrorMessage("");
    setDateErrorMessage("");

    return {
      ok: true as const,
      value: { title: v.value, range },
    };
  };

  const resetAll = () => {
    setTitle("");
    setRange(undefined);
    setDraftRange(undefined);
    setCalendarMonth(getToday());
    setIsCalendarOpen(false);
    setTitleErrorMessage("");
    setDateErrorMessage("");
  };

  return {
    // values
    title,
    range,
    draftRange,

    // ui
    isCalendarOpen,
    calendarMonth,

    // errors
    titleErrorMessage,
    dateErrorMessage,

    dateText,
    isChange,

    // handlers
    onTitleChange,
    validateTitleOnBlur,

    openCalendar,
    onCalendarOpenChange,
    completeCalendar,

    // setters
    setDraftRange,
    setCalendarMonth,
    setRange,

    // error setters
    setTitleErrorMessage,
    setDateErrorMessage,

    // submit validation
    validateForSubmit,

    resetAll,
  };
};
