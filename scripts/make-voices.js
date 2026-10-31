// Makes the ghost's voice files from the lines in src/lines.js.
//   npm run voices:list   prints every sound name and the exact words to record
//   npm run voices        (Windows only) makes sounds/*.wav with the built-in voice
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  emptyInputLines,
  smallTalkReplies,
  offTopicReplies,
  fallbackReplies,
} from "../src/lines.js";

const allLines = [...emptyInputLines, ...smallTalkReplies, ...offTopicReplies, ...fallbackReplies];

// What the voice should say: the text, then the follow-up question if there is one.
const spoken = (line) => (line.follow_up ? `${line.text} ${line.follow_up}` : line.text);

if (process.argv.includes("--list")) {
  for (const line of allLines) console.log(`${line.sound}.wav\n  ${spoken(line)}\n`);
  process.exit(0);
}

if (process.platform !== "win32") {
  console.log("This helper uses the built-in Windows voice.");
  console.log("On other systems, record the lines from `npm run voices:list` yourself.");
  process.exit(0);
}

const soundsDir = fileURLToPath(new URL("../sounds/", import.meta.url));
mkdirSync(soundsDir, { recursive: true });

const RATE = -3; // -10 is slowest, 10 is fastest. Slower sounds creepier.

for (const line of allLines) {
  const outFile = `${soundsDir}${line.sound}.wav`.replaceAll("'", "''");
  const words = spoken(line).replaceAll("'", "''");
  const script = [
    "Add-Type -AssemblyName System.Speech",
    "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer",
    `$s.Rate = ${RATE}`,
    `$s.SetOutputToWaveFile('${outFile}')`,
    `$s.Speak('${words}')`,
    "$s.Dispose()",
  ].join("; ");

  execFileSync("powershell", ["-NoProfile", "-Command", script]);
  console.log(`made sounds/${line.sound}.wav`);
}