import { format, parse, type Locale } from "date-fns";
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
 * yyyy-MM-dd 문자열 → Date 객체 변환
 */
export const fromApiDate = (dateString: string): Date => {
  return parse(dateString, "yyyy-MM-dd", new Date());
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
 * start_date, end_date → DateRange 변환
 */
export const fromApiDateRange = (
  startDate: string,
  endDate: string,
): DateRange => {
  return {
    from: fromApiDate(startDate),
    to: fromApiDate(endDate),
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

/**
 * yyyy-MM-dd 형식의 문자열을 yyyy.MM.dd 형식으로 변환
 */
export const formatDateToDot = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}.${mm}.${dd}`;
};

/**
 * start_date, end_date를 받아
 * yyyy.MM.dd ~ yyyy.MM.dd 형태로 반환
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const formattedStart = formatDateToDot(startDate);
  const formattedEnd = formatDateToDot(endDate);

  if (!formattedStart || !formattedEnd) return "";

  return `${formattedStart} ~ ${formattedEnd}`;
};

/**
 * 두 Date가 같은 날짜인지 비교 (연/월/일 기준)
 */
export const isSameDay = (a?: Date, b?: Date): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

/**
 * 두 DateRange가 같은 범위인지 비교
 */
export const isSameDateRange = (a?: DateRange, b?: DateRange): boolean => {
  return isSameDay(a?.from, b?.from) && isSameDay(a?.to, b?.to);
};

/**
 * API day_of_week(EN) → 한글 요일(일~토)
 */
export const dayOfWeekToKo = (dayOfWeek?: string): string => {
  if (!dayOfWeek) return "";

  const map: Record<string, string> = {
    SUNDAY: "일",
    MONDAY: "월",
    TUESDAY: "화",
    WEDNESDAY: "수",
    THURSDAY: "목",
    FRIDAY: "금",
    SATURDAY: "토",
  };

  return map[dayOfWeek.toUpperCase()] ?? "";
};

/**
 * yyyy-MM-dd → yy.MM.dd 변환
 * 예: 2026-02-25 → 2026.02.25
 */
export const formatDateToDotYY = (dateString: string): string => {
  if (!dateString) return "";

  const date = fromApiDate(dateString);
  if (isNaN(date.getTime())) return "";

  const yy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yy}.${mm}.${dd}`;
};

/**
 * day_info(date, day_of_week) → "YY.MM.DD (요일)" 형태로 변환
 * 예: ("2026-02-25", "WEDNESDAY") → "2026.02.25 (수)"
 */
export const formatDayInfoText = (
  dateString: string,
  dayOfWeek: string,
): string => {
  const dateText = formatDateToDotYY(dateString);
  const dayText = dayOfWeekToKo(dayOfWeek);

  if (!dateText) return "";
  if (!dayText) return dateText;

  return `${dateText} (${dayText})`;
};
