import { printBanner, typeOut } from "./display.js";
import { startupWarning, emptyInputLines, smallTalkReplies, pick } from "./lines.js";
import { ghostArts } from "./art.js";
import { judgeInput } from "./bouncer.js";
import { haunt } from "./pipeline.js";
import { ModelError } from "./model.js";
import { config } from "./config.js";

export async function main(args) {
  const question = args.join(" ").trim().slice(0, config.maxQuestionLength);
  const verdict = judgeInput(question);

  if (verdict === "empty") {
    printBanner(pick(ghostArts), startupWarning);
    await typeOut(pick(emptyInputLines), { color: "purple" });
    return;
  }

  if (verdict === "small_talk") {
    const reply = pick(smallTalkReplies);
    await typeOut(reply.text, { color: "purple" });
    console.log();
    await typeOut(reply.follow_up, { color: "purple" });
    return;
  }

  try {
    const result = await haunt(question);
    await typeOut(result.text, { color: "purple" });
    console.log();
    await typeOut(result.follow_up, { color: "purple" });
  } catch (err) {
    if (err instanceof ModelError) {
      console.error(`The spirits are silent: ${err.message}`);
      return;
    }
    throw err;
  }
}