export const RESERVATION_TTL_MS = 17 * 60 * 1000;

export function reservationExpiresAt(createdAtMs) {
  return createdAtMs + RESERVATION_TTL_MS;
}
