import { format, type Locale } from "date-fns";
import { DateRange } from "react-day-picker";

/**
 * 오늘 날짜 (00:00:00 기준) 반환
 */
export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Date → API 전송용 문자열 변환
 *
 * - 포맷: YYYY-MM-DD
 * - 예: 2025-04-03
 */
export const toApiDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

/**
 * DateRange → API 전송용 날짜 범위 객체 변환
 *
 * - from, to 둘 다 존재할 때만 변환
 * - 하나라도 없으면 null 반환
 */
export const toApiDateRange = (
  range?: DateRange,
): { start_date: string; end_date: string } | null => {
  if (!range?.from || !range?.to) return null;

  return {
    start_date: toApiDate(range.from),
    end_date: toApiDate(range.to),
  };
};

/**
 * DateRange → 화면 표시용 문자열 변환
 *
 * - 기본 포맷: YYYY.MM.DD ~ YYYY.MM.DD
 * - 종료일이 없으면 "YYYY.MM.DD ~" 형태로 반환
 */
export const formatDateRangeText = (
  range?: DateRange,
  pattern: string = "yyyy.MM.dd",
  separator: string = " ~ ",
  locale?: Locale,
): string => {
  if (!range?.from) return "";

  const from = format(range.from, pattern, locale ? { locale } : undefined);
  if (!range.to) return `${from}${separator}`;

  const to = format(range.to, pattern, locale ? { locale } : undefined);
  return `${from}${separator}${to}`;
};
