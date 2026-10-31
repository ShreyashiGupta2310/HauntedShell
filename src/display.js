const RESET = "\x1b[0m";

const colors = {
  purple: "\x1b[35m",
  dim: "\x1b[2m",
};

const MAX_TYPING_MS = 4000;

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

export function paint(text, color) {
  if (!useColor) return text;
  return `${colors[color]}${text}${RESET}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function typeOut(text, { color, delay = 12 } = {}) {
  if (!process.stdout.isTTY) {
    console.log(text);
    return;
  }

  // Slow typing is nice for short lines and annoying for long ones, so the
  // whole text is capped at about 4 seconds.
  const pause = Math.min(delay, Math.floor(MAX_TYPING_MS / text.length));

  if (color && useColor) process.stdout.write(colors[color]);
  for (const char of text) {
    process.stdout.write(char);
    await sleep(pause);
  }
  if (color && useColor) process.stdout.write(RESET);
  process.stdout.write("\n");
}

export function printBanner(art, warning) {
  console.log(paint(art, "purple"));
  console.log(paint("  H A U N T E D  S H E L L", "purple"));
  console.log(paint(`  ${warning}`, "dim"));
  console.log();
}