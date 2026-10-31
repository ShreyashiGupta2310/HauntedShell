import { test } from "node:test";
import assert from "node:assert/strict";
import { checkReply, tidy } from "../src/checker.js";

// A reply that should pass. Each test below breaks exactly one thing.
function goodReply(changes = {}) {
  return {
    on_topic: true,
    topic: "concurrency",
    spooky_answer: "Two threads reach for the same shared data at once, and the winner is decided in the dark.",
    key_terms: ["threads", "shared data"],
    follow_up: "Who guards the lock when no one is watching?",
    ...changes,
  };
}

function assertRejected(reply, expectedText) {
  const verdict = checkReply(reply);
  assert.equal(verdict.ok, false);
  assert.ok(
    verdict.problems.some((p) => p.includes(expectedText)),
    `expected a problem containing "${expectedText}", got: ${verdict.problems.join(" | ")}`
  );
}

test("a good reply passes", () => {
  const verdict = checkReply(goodReply());
  assert.equal(verdict.ok, true);
  assert.deepEqual(verdict.problems, []);
});

test("missing or empty fields are rejected", () => {
  assertRejected(goodReply({ follow_up: "" }), "follow_up is missing");
  assertRejected(goodReply({ spooky_answer: undefined }), "spooky_answer is missing");
  assertRejected(goodReply({ key_terms: "threads" }), "key_terms is not a list");
  assertRejected(goodReply({ on_topic: "true" }), "on_topic");
});

test("a follow-up must be exactly one question", () => {
  assertRejected(goodReply({ follow_up: "Who guards the lock." }), "question mark");
  assertRejected(goodReply({ follow_up: "Who guards it? And why?" }), "exactly one question");
});

test("a very long answer is rejected", () => {
  assertRejected(goodReply({ spooky_answer: "threads shared data " + "boo ".repeat(300) }), "too long");
});

test("scary wording aimed at a person is rejected", () => {
  assertRejected(goodReply({ spooky_answer: "I will kill you, threads, shared data." }), "kill you");
  assertRejected(goodReply({ spooky_answer: "A gory tale of threads and shared data." }), "gory");
});

test("normal developer words like 'kill' are allowed", () => {
  const verdict = checkReply(
    goodReply({ spooky_answer: "Use kill -9 on the stuck process, but only after threads and shared data are saved." })
  );
  assert.equal(verdict.ok, true);
});

test("the answer must keep at least half of the key terms", () => {
  assertRejected(
    goodReply({ spooky_answer: "Something spooky happens in the dark.", key_terms: ["threads", "shared data"] }),
    "key terms survived"
  );
  const half = checkReply(goodReply({ key_terms: ["threads", "mutex"] }));
  assert.equal(half.ok, true); // 1 of 2 is enough
});

test("key term matching ignores capital letters", () => {
  const verdict = checkReply(goodReply({ key_terms: ["THREADS"] }));
  assert.equal(verdict.ok, true);
});

test("markdown leftovers are cleaned from a passing reply", () => {
  const verdict = checkReply(goodReply({ spooky_answer: "Two **threads** touch `shared data` at once." }));
  assert.equal(verdict.ok, true);
  assert.equal(verdict.reply.spooky_answer, "Two threads touch shared data at once.");
});

test("tidy removes backticks, asterisks and extra spaces", () => {
  assert.equal(tidy("  a  `b`  **c**  "), "a b c");
});