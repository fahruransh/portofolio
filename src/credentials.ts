export const credentialExpiryMonths = {
  ccna: "2029-07",
  microsoft: "2027-12",
  google: "2026-12",
  bnsp: "2024-09",
} as const;

// Supplied dates have month precision. The final month is inclusive (UTC).
// This evaluates the stated expiry only; it does not verify issuer credentials.
export function credentialStatus(
  expiresMonth: string,
  now: Date = new Date(),
): "active" | "expired" {
  const [year, month] = expiresMonth.split("-").map(Number);
  return now.getTime() < Date.UTC(year, month, 1) ? "active" : "expired";
}
