import { parseArgs } from "node:util";
import { printBanner, typeOut } from "./display.js";
import {
  startupWarning,
  emptyInputLines,
  smallTalkReplies,
  pick,
} from "./lines.js";
import { ghostArts } from "./art.js";
import { judgeInput } from "./bouncer.js";
import { haunt, fallbackReply } from "./pipeline.js";
import { ModelError } from "./model.js";
import { playSound } from "./sound.js";
import { debug } from "./debug.js";
import { config } from "./config.js";

const USAGE = `HauntedShell: ask a ghost your developer questions.

Usage:
  hauntedshell "your question"
  hauntedshell                      summon the ghost

Options:
  --offline    skip the AI and use the ghost's pre-written lines
  --mute       turn off sound
  -h, --help   show this help

Settings (in .env or your environment):
  GEMINI_API_KEY         your Gemini API key
  HAUNTEDSHELL_MODEL     which model to use
  HAUNTEDSHELL_DEBUG=1   print timings and error details`;

// Reads the flags. An unknown flag is real misuse, so it gets a clear message
// and a non-zero exit code.
function readArgs(args) {
  try {
    return parseArgs({
      args,
      allowPositionals: true,
      options: {
        offline: { type: "boolean" },
        mute: { type: "boolean" },
        help: { type: "boolean", short: "h" },
      },
    });
  } catch (err) {
    console.error(`${err.message}\n\n${USAGE}`);
    process.exitCode = 1;
    return null;
  }
}

// Plays the line's sound (if any), then types the text and the follow-up.
async function speak(reply, mute) {
  playSound(reply.sound, { mute });
  await typeOut(reply.text, { color: "purple" });
  if (reply.follow_up) {
    console.log();
    await typeOut(reply.follow_up, { color: "purple" });
  }
}

async function run(args) {
  const parsed = readArgs(args);
  if (!parsed) return;

  const { values, positionals } = parsed;

  if (values.help) {
    console.log(USAGE);
    return;
  }

  const mute = Boolean(values.mute);
  const question = positionals.join(" ").trim().slice(0, config.maxQuestionLength);
  const verdict = judgeInput(question);

  if (verdict === "empty") {
    const line = pick(emptyInputLines);
    printBanner(pick(ghostArts), startupWarning);
    await speak(line, mute);
    return;
  }

  if (verdict === "small_talk") {
    await speak(pick(smallTalkReplies), mute);
    return;
  }

  try {
    const result = values.offline ? fallbackReply("offline") : await haunt(question);
    debug(`source: ${result.source}`);
    await speak(result, mute);
  } catch (err) {
    if (err instanceof ModelError) {
      // A setup problem (key, model name). The user can fix it, so say so.
      console.error(`The spirits are silent: ${err.message}`);
      process.exitCode = 1;
      return;
    }
    throw err;
  }
}

// The last safety net: nothing should ever show the user a raw stack trace.
export async function main(args) {
  try {
    await run(args);
  } catch (err) {
    debug(err.stack);
    console.error("The ghost tripped over something unexpected. Run with HAUNTEDSHELL_DEBUG=1 for details.");
    process.exitCode = 1;
  }
}