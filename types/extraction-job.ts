export type FromUrlStatus =
  | "PENDING"
  | "EXTRACTING"
  | "SEARCHING"
  | "COMPLETED"
  | "FAILED"
  | "RETRY_WAITING";

export type FailureCode =
  | "CONTENT_NOT_FOUND"
  | "NO_PLACE_EXTRACTED"
  | "VIDEO_TOO_SHORT"
  | "VIDEO_TOO_LONG"
  | "UNEXPECTED_ERROR"
  | "YOUTUBE_API_ERROR"
  | "GENAI_ERROR";

export type DecisionStatus = "UNDECIDED" | "SELECTED" | "IGNORED";

export type ExtractionJobPlace = {
  place_id: string;
  name: string;
  address: string;
};

export type ExtractionJobResult = {
  detected_count: number;
  matched_count: number;
  media_type: string;
  url: string;
  author_name: string;
  title: string;
  summary: string;
  places: ExtractionJobPlace[];
};

export type ExtractionJobResponse = {
  job_id: string;
  requested_at: string;
  status: FromUrlStatus;
  failure_code?: FailureCode | null;
  failure_message?: string | null;
  decision_status: DecisionStatus;
  decided_at?: string | null;
  result: ExtractionJobResult;
};

export type CreateExtractionJobResponse = {
  job_id: string;
  status: FromUrlStatus;
};
