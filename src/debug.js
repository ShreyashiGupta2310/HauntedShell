import { config } from "./config.js";

// Prints extra details to the error channel, only when HAUNTEDSHELL_DEBUG=1.
// Normal users never see these lines.
export function debug(...parts) {
  if (config.debug) console.error("[debug]", ...parts);
}