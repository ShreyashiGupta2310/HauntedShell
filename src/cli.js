import { printBanner, typeOut } from "./display.js";
import { startupWarning, emptyInputLines, pick } from "./lines.js";
import { ghostArts } from "./art.js";
export async function main(args) {
  const question = args.join(" ").trim();

  if (question === "") {
    printBanner(pick(ghostArts), startupWarning);
    await typeOut(pick(emptyInputLines), { color: "purple" });
    return;
  }

  console.log(`You asked: ${question}`);
}