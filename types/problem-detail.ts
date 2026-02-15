/**
 * 공통 API 에러 응답 타입
 */
export type ProblemDetail = {
  type?: string | null;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code?: string | null;
  errors?: Array<{
    field?: string;
    reason?: string;
    code?: string;
    value?: string;
  }> | null;
};
