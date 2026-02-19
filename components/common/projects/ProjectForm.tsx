"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldDescription } from "@/components/ui/field-description";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { getToday } from "@/lib/utils/date";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

type ProjectFormProps = {
  // title
  title: string;
  titleErrorMessage: string;
  onTitleChange: (value: string) => void;
  onTitleBlur: () => void;

  // date
  dateText: string;
  dateErrorMessage: string;

  // dialog/calendar
  isCalendarOpen: boolean;
  calendarMonth: Date;
  draftRange: DateRange | undefined;

  onCalendarOpenChange: (open: boolean) => void;
  onOpenCalendar: () => void;

  onDraftRangeChange: (range: DateRange | undefined) => void;
  onMonthChange: (month: Date) => void;
  onCompleteCalendar: () => void;
};

const ProjectForm = ({
  title,
  titleErrorMessage,
  onTitleChange,
  onTitleBlur,

  dateText,
  dateErrorMessage,

  isCalendarOpen,
  calendarMonth,
  draftRange,

  onCalendarOpenChange,
  onOpenCalendar,

  onDraftRangeChange,
  onMonthChange,
  onCompleteCalendar,
}: ProjectFormProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* 여행 이름 */}
      <div className="flex flex-col gap-2">
        <Label required labelClassName="typography-label-sm-sb">
          여행 이름
        </Label>
        <div className="flex flex-col gap-1.5">
          <InputForm
            hideIcon
            value={title}
            error={!!titleErrorMessage}
            placeholder="예) 제주도 첫 캠핑"
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleBlur}
          />
          {titleErrorMessage && (
            <FieldDescription error>{titleErrorMessage}</FieldDescription>
          )}
        </div>
      </div>

      {/* 여행 날짜 */}
      <div className="flex flex-col gap-2">
        <Label required labelClassName="typography-label-sm-sb">
          여행 날짜
        </Label>
        <Dialog open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
          <div className="flex flex-col gap-1.5">
            <InputForm
              icon={CalendarIcon}
              iconClassName="text-foreground"
              iconClick={onOpenCalendar}
              placeholder="여행 시작과 종료일을 입력해주세요"
              value={dateText}
              readOnly
            />
            {dateErrorMessage && (
              <FieldDescription error>{dateErrorMessage}</FieldDescription>
            )}
          </div>

          <DialogContent className="rounded-3xl">
            <DialogHeader className="text-start">
              <DialogTitle className="typography-display-lg-bold">
                여행 날짜를 선택해주세요.
              </DialogTitle>
              <DialogDescription className="typography-action-sm-leg text-muted-foreground whitespace-pre-line">
                여행 시작과 종료일을 선택해주세요.
              </DialogDescription>
            </DialogHeader>
            {/* 달력 */}
            <Calendar
              mode="range"
              locale={ko}
              selected={draftRange}
              onSelect={onDraftRangeChange}
              disabled={{ before: getToday() }}
              month={calendarMonth}
              onMonthChange={onMonthChange}
              className="w-full border-border border rounded-xl"
            />
            <DialogFooter>
              <Button
                size="S"
                type="button"
                onClick={onCompleteCalendar}
                disabled={!draftRange?.from || !draftRange?.to}
                className="w-full typography-body-sm-sb"
              >
                선택 완료
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectForm;
