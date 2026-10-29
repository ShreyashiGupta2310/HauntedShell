import { printBanner, typeOut } from "./display.js";
import { startupWarning, emptyInputLines, pick ,smallTalkReplies} from "./lines.js";
import { ghostArts } from "./art.js";
import { judgeInput } from "./bouncer.js";
export async function main(args) {
  const question = args.join(" ").trim();
  const verdict = judgeInput(question);

  if (verdict === "") {
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

  console.log(`You asked: ${question}`);
}