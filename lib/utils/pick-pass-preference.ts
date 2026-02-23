export type PickPassPreference = "PICK" | "PASS" | "NOTHING";

export const normalizePickPassPreference = (
  value: unknown,
): PickPassPreference => {
  if (typeof value !== "string") return "NOTHING";

  const normalized = value.trim().toUpperCase();
  if (normalized === "PICK" || normalized === "PASS") {
    return normalized;
  }

  return "NOTHING";
};
