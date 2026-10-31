import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function soundPath(name) {
  return fileURLToPath(new URL(`../sounds/${name}.wav`, import.meta.url));
}

// Plays sounds/<name>.wav using the operating system's own player.
// Sound is a bonus, so this never throws: if anything is missing or fails,
// the ghost just stays silent. Returns true only if playback was started.
export function playSound(name, { mute = false } = {}) {
  if (mute || !name) return false;
  if (!process.stdout.isTTY) return false; // no sound when output is piped or tested

  const file = soundPath(name);
  if (!existsSync(file)) return false;

  let command;
  let args;
  if (process.platform === "win32") {
    const safePath = file.replaceAll("'", "''");
    command = "powershell";
    args = ["-NoProfile", "-Command", `(New-Object Media.SoundPlayer '${safePath}').PlaySync()`];
  } else if (process.platform === "darwin") {
    command = "afplay";
    args = [file];
  } else {
    command = "aplay";
    args = ["-q", file];
  }

  try {
    const child = spawn(command, args, { stdio: "ignore", windowsHide: true });
    child.on("error", () => {}); // player missing? stay silent
    return true;
  } catch {
    return false;
  }
}