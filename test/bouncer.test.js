import { test } from "node:test";
import assert from "node:assert/strict";
import { judgeInput } from "../src/bouncer.js";

test("empty, spaces-only and punctuation-only input is 'empty'", () => {
  for (const text of ["", "   ", "???", " ! "]) {
    assert.equal(judgeInput(text), "empty", `input: "${text}"`);
  }
});

test("plain greetings and thanks are small talk", () => {
  const inputs = [
    "hi",
    "Hello!",
    "hey what's up",
    "HEY THERE",
    "hello there",
    "good morning",
    "how are you doing?",
    "thanks",
    "hey ghost, how are you",
  ];
  for (const text of inputs) {
    assert.equal(judgeInput(text), "small_talk", `input: "${text}"`);
  }
});

test("a greeting followed by a real question is NOT small talk", () => {
  const inputs = [
    "hey, how do I center a div?",
    "hi what is a race condition",
    "hello can you explain closures",
  ];
  for (const text of inputs) {
    assert.equal(judgeInput(text), "ok", `input: "${text}"`);
  }
});

test("real questions pass through", () => {
  const inputs = [
    "what is a race condition",
    "difference between a process and a thread",
    "how do I kill a stuck process?",
  ];
  for (const text of inputs) {
    assert.equal(judgeInput(text), "ok", `input: "${text}"`);
  }
});

test("text in other scripts is kept, not erased", () => {
  assert.equal(judgeInput("थ्रेड क्या है"), "ok");
});

test("unrelated chatter is let through; the chef decides later", () => {
  assert.equal(judgeInput("what is a good pasta recipe"), "ok");
});