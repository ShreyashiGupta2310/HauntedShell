// The inspector. The AI's reply is never trusted: every reply is checked
// here before the user sees it. If anything is wrong, the pipeline prints a
// pre-written ghost line instead.

const MAX_ANSWER_LENGTH = 700;

// How many of the "key terms" must still appear in the spooky answer.
// 0.5 means at least half. The decorator may change style, not facts.
const MIN_TERM_SHARE = 0.5;

// Whole words that never belong in a friendly spooky answer.
const BANNED_WORDS = [
  "gore", "gory", "suicide", "murder", "torture", "bloodbath", "slaughter", "decapitate",
];

// Phrases that aim something scary at the person. Note that "kill" alone is
// NOT banned, because developers say "kill the process" all the time.
const BANNED_PHRASES = [
  "kill you", "kill yourself", "hurt you", "harm yourself", "you will die",
  "i know where you live", "i am watching you", "your family",
];

// Removes markdown leftovers (backticks, asterisks) and extra spaces.
export function tidy(text) {
  return text.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
}

function isText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Returns the banned word or phrase it found, or undefined if all is clean.
function findBanned(text) {
  const lower = text.toLowerCase();
  const word = BANNED_WORDS.find((w) => new RegExp(`\\b${w}\\b`).test(lower));
  if (word) return word;
  return BANNED_PHRASES.find((p) => lower.includes(p));
}

// Gives back { ok, problems } and, when ok, a cleaned copy of the reply.
export function checkReply(reply) {
  const problems = [];

  if (reply.on_topic !== true) problems.push("on_topic is not true");
  if (!isText(reply.spooky_answer)) problems.push("spooky_answer is missing");
  if (!isText(reply.follow_up)) problems.push("follow_up is missing");
  if (!Array.isArray(reply.key_terms)) problems.push("key_terms is not a list");

  // If the basic shape is wrong, the checks below cannot run.
  if (problems.length > 0) return { ok: false, problems };

  const answer = tidy(reply.spooky_answer);
  const followUp = tidy(reply.follow_up);

  if (answer.length > MAX_ANSWER_LENGTH) {
    problems.push(`spooky_answer is too long (${answer.length} characters)`);
  }

  if (!followUp.endsWith("?")) {
    problems.push("follow_up does not end with a question mark");
  }
  if (followUp.split("?").length - 1 !== 1) {
    problems.push("follow_up should contain exactly one question");
  }

  const banned = findBanned(`${answer} ${followUp}`);
  if (banned) problems.push(`contains banned wording: "${banned}"`);

  const terms = reply.key_terms.filter(isText);
  if (terms.length === 0) {
    problems.push("key_terms is empty");
  } else {
    const lowerAnswer = answer.toLowerCase();
    const found = terms.filter((t) => lowerAnswer.includes(t.toLowerCase()));
    if (found.length / terms.length < MIN_TERM_SHARE) {
      problems.push(`only ${found.length} of ${terms.length} key terms survived in the answer`);
    }
  }

  if (problems.length > 0) return { ok: false, problems };

  return {
    ok: true,
    problems: [],
    reply: { ...reply, spooky_answer: answer, follow_up: followUp },
  };
}