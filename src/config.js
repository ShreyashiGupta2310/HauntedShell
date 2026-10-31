//the below code will read my .env file(.env), so the key becomes available as process.env.GEMINI_API_KEY. (That’s called an environment variable.)
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(new URL("../.env", import.meta.url));

try {
  process.loadEnvFile(envPath);
} catch (err) {
  if (err.code !== "ENOENT") throw err;
}


//part b: 
export const config = {
  model: process.env.HAUNTEDSHELL_MODEL || "gemini-3.5-flash",
  maxQuestionLength: 300,
  timeoutMs: 20000,
  retryDelayMs: 1000,
  debug: process.env.HAUNTEDSHELL_DEBUG === "1",
};