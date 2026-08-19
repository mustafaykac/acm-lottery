import bcrypt from "bcryptjs";

/**
 * Node-only (bcrypt). Import this ONLY from Node route handlers, never from
 * middleware.ts (which may run in the Edge runtime) - see lib/session.ts for
 * the Edge-safe session token helpers.
 */
export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminUsername || !adminHash) return false;
  const usernameMatches = username === adminUsername;
  // Always run bcrypt.compareSync against the real hash (even on a username
  // mismatch) so response timing doesn't leak whether the username was correct.
  const passwordMatches = bcrypt.compareSync(password, adminHash);
  return usernameMatches && passwordMatches;
}
