export function main(args) {
  const question = args.join(" ").trim();

  if (question === "") {
    console.log("The ghost is waiting... ask it something.");
    return;
  }

  console.log(`You asked: ${question}`);
}