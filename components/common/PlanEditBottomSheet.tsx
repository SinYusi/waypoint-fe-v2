"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { BottomSheet } from "../ui/bottom-sheet";
import { Label } from "../ui/label";
import { InputForm } from "../ui/input-form";
import { FieldDescription } from "../ui/field-description";

const DEFAULT_TIME = "00:00";

const toDigitIndex = (cursor: number) => {
  if (cursor <= 1) return cursor;
  if (cursor === 2) return 2;
  return Math.min(cursor - 1, 3);
};

const toCursorPosition = (digitIndex: number) => {
  if (digitIndex <= 1) return digitIndex;
  return digitIndex + 1;
};

const replaceTimeDigit = (
  value: string,
  digitIndex: number,
  nextDigit: string,
) => {
  const chars = value.split("");
  const valueIndex = digitIndex >= 2 ? digitIndex + 1 : digitIndex;
  chars[valueIndex] = nextDigit;
  return chars.join("");
};

const setCaret = (input: HTMLInputElement, digitIndex: number) => {
  const pos = toCursorPosition(Math.max(0, Math.min(4, digitIndex)));
  requestAnimationFrame(() => input.setSelectionRange(pos, pos));
};

const isValidTime = (value: string) => {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

const toMinutes = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
};

interface PlanEditBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSubmit?: (payload: {
    day?: number;
    startTime?: string;
    endTime?: string;
  }) => void;

  defaultDay?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

const PlanEditBottomSheet = ({
  open,
  onOpenChange,
  onSubmit,
  defaultDay = "",
  defaultStartTime = DEFAULT_TIME,
  defaultEndTime = DEFAULT_TIME,
}: PlanEditBottomSheetProps) => {
  const [day, setDay] = useState(defaultDay);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);

  const dayNumber = useMemo(() => Number(day.replace(/[^\d]/g, "")), [day]);

  const isDayValid = Number.isInteger(dayNumber) && dayNumber > 0;

  const isStartTimeValid = isValidTime(startTime);
  const isEndTimeValid = isValidTime(endTime);
  const isStartNotAfterEnd =
    isStartTimeValid && isEndTimeValid
      ? toMinutes(startTime) <= toMinutes(endTime)
      : false;

  const isStartTimeProvided = startTime !== DEFAULT_TIME;
  const isEndTimeProvided = endTime !== DEFAULT_TIME;
  const isTimeAttempted = isStartTimeProvided || isEndTimeProvided;

  // 시간 수정 가능 조건: 둘 다 입력 + 둘 다 유효 + 범위 유효
  const isTimeRangeValid =
    isStartTimeProvided &&
    isEndTimeProvided &&
    isStartTimeValid &&
    isEndTimeValid &&
    isStartNotAfterEnd;

  // error
  const showTimeError = isTimeAttempted && !isTimeRangeValid;

  const digitsOnly = (v: string) => v.replace(/[^\d]/g, "");

  const defaultDayDigits = useMemo(() => digitsOnly(defaultDay), [defaultDay]);
  const currentDayDigits = useMemo(() => digitsOnly(day), [day]);

  const isDayDirty =
    currentDayDigits.length > 0 && currentDayDigits !== defaultDayDigits;
  const isStartDirty = startTime !== defaultStartTime;
  const isEndDirty = endTime !== defaultEndTime;

  const isAnythingDirty = isDayDirty || isStartDirty || isEndDirty;

  // 최종 제출 가능 조건
  // - 날짜만 유효하거나
  // - (날짜 없어도) 시간 범위가 유효하거나
  // - 둘 다 유효하면 true
  const canSubmit =
    isAnythingDirty && (isDayValid || isTimeRangeValid) && !showTimeError;

  const handleTimeKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    setValue: (next: string) => void,
  ) => {
    const input = e.currentTarget;
    const key = e.key;

    if (
      key === "Tab" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Home" ||
      key === "End"
    ) {
      return;
    }

    const cursor = input.selectionStart ?? 0;
    const digitIndex = toDigitIndex(cursor);

    if (/^\d$/.test(key)) {
      e.preventDefault();
      const next = replaceTimeDigit(value, digitIndex, key);
      setValue(next);
      setCaret(input, digitIndex + 1);
      return;
    }

    if (key === "Backspace") {
      e.preventDefault();
      const prevDigitIndex = Math.max(0, digitIndex - (cursor > 0 ? 1 : 0));
      const next = replaceTimeDigit(value, prevDigitIndex, "0");
      setValue(next);
      setCaret(input, prevDigitIndex);
      return;
    }

    if (key === "Delete") {
      e.preventDefault();
      const next = replaceTimeDigit(value, digitIndex, "0");
      setValue(next);
      setCaret(input, digitIndex);
      return;
    }

    if (key === ":") {
      e.preventDefault();
      setCaret(input, 2);
      return;
    }

    e.preventDefault();
  };

  const resetToDefaults = () => {
    setDay(defaultDay);
    setStartTime(defaultStartTime);
    setEndTime(defaultEndTime);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    resetToDefaults();
    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (!canSubmit) return;

    const payload: { day?: number; startTime?: string; endTime?: string } = {};

    // 날짜만 입력해도 OK
    if (isDayValid) payload.day = dayNumber;

    // 시간은 둘 다 입력 + 유효할 때만 OK
    if (isTimeRangeValid) {
      payload.startTime = startTime;
      payload.endTime = endTime;
    }

    if (Object.keys(payload).length === 0) return;

    onSubmit?.(payload);
    handleOpenChange(false);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={handleOpenChange}
      cancelLabel="취소"
      cancelVariant="outline"
      confirmLabel="수정하기"
      confirmDisabled={!canSubmit}
      closeOnConfirm={false}
      onConfirm={handleConfirm}
      showDivider
      content={
        <div className="flex flex-col gap-8 pb-3.5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-day">
              <span className="typography-label-sm-sb text-foreground">
                날짜
              </span>
            </Label>
            <InputForm
              id="edit-day"
              hideIcon
              placeholder="예) 1일차"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-start-time">
              <span className="typography-label-sm-sb text-foreground">
                시작 시간
              </span>
            </Label>
            <InputForm
              id="edit-start-time"
              hideIcon
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={startTime}
              onKeyDown={(e) => handleTimeKeyDown(e, startTime, setStartTime)}
              onFocus={(e) => setCaret(e.currentTarget, 0)}
              onChange={() => {}}
              error={
                showTimeError && (!isStartTimeValid || !isStartNotAfterEnd)
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-end-time">
              <span className="typography-label-sm-sb text-foreground">
                종료 시간
              </span>
            </Label>
            <InputForm
              id="edit-end-time"
              hideIcon
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={endTime}
              onKeyDown={(e) => handleTimeKeyDown(e, endTime, setEndTime)}
              onFocus={(e) => setCaret(e.currentTarget, 0)}
              onChange={() => {}}
              error={showTimeError && (!isEndTimeValid || !isStartNotAfterEnd)}
            />
            {showTimeError ? (
              !isStartTimeProvided || !isEndTimeProvided ? (
                <FieldDescription error>
                  시작/종료 시간을 모두 입력해 주세요.
                </FieldDescription>
              ) : isStartTimeValid && isEndTimeValid && !isStartNotAfterEnd ? (
                <FieldDescription error>
                  종료 시간은 시작 시간보다 빠를 수 없어요.
                </FieldDescription>
              ) : null
            ) : null}
          </div>
        </div>
      }
    />
  );
};

export default PlanEditBottomSheet;
