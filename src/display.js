const RESET = "\x1b[0m";

const colors = {
  purple: "\x1b[35m",
  dim: "\x1b[2m",
};

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
  if (color && useColor) process.stdout.write(colors[color]);
  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  if (color && useColor) process.stdout.write(RESET);
  process.stdout.write("\n");
}

export function printBanner(art, warning) {
  console.log(paint(art, "purple"));
  console.log(paint("  H A U N T E D S H E L L", "purple"));
  console.log(paint(`  ${warning}`, "dim"));
  console.log();
}


