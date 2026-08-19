/**
 * Generates a bcrypt hash for use as ADMIN_PASSWORD_HASH in .env.
 * Usage: npm run hash-password -- "MyStrongPassword123!"
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "<password>"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password should be at least 8 characters.");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
// IMPORTANT: Next.js's own .env loader expands "$" as if it were a shell
// variable reference (like dotenv-expand), which silently mangles bcrypt
// hashes (they're full of "$"). Every "$" below MUST be escaped as "\$" or
// the hash will be truncated and login will always fail with no obvious error.
const escaped = hash.replace(/\$/g, "\\$");
console.log("\nAdd this line to your .env file EXACTLY as shown (the backslashes before each $ are required):\n");
console.log(`ADMIN_PASSWORD_HASH=${escaped}\n`);
