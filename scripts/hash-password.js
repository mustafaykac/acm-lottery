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
const escaped = hash.replace(/\$/g, "\\$");

// IMPORTANT: Next.js's own .env loader expands "$" as if it were a shell
// variable reference (like dotenv-expand), which silently mangles bcrypt
// hashes (they're full of "$") if left unescaped. Which form you need
// depends on how the value reaches process.env:
console.log("\nLocal dev (.env / .env.local loaded directly by Next.js) - escape every \"$\":\n");
console.log(`ADMIN_PASSWORD_HASH=${escaped}\n`);
console.log("Production via systemd EnvironmentFile (see README > Live Deployment) -");
console.log("systemd does NOT do \"$\" expansion, so use the RAW hash instead:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
console.log("(scripts/deploy.sh already deletes the .env copy Next.js auto-places in");
console.log(".next/standalone/ after every build, which is what would otherwise re-mangle");
console.log("the raw value at runtime - see the comment in that script for details.)\n");
