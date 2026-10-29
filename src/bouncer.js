// The bouncer decides one thing: is this message ONLY small talk (or nothing)?
// It does not try to decide whether a question is about software. The chef
// step (later) does that.

const SMALL_TALK_PHRASES = [
  "good morning",
  "good afternoon",
  "good evening",
  "good night",
  "how are you doing",
  "how are you",
  "how is it going",
  "hows it going",
  "what is up",
  "whats up",
  "wassup",
  "thank you",
  "thanks",
  "goodbye",
  "bye",
  "hello",
  "hey",
  "hii",
  "hi",
  "yo",
  "sup",
  "there",
  "ghost",
  "buddy",
  "friend",
];

// Longest phrases first, so "how are you doing" is removed as one piece
// before "how are you" gets a chance to match part of it.
const byLongestFirst = [...SMALL_TALK_PHRASES].sort((a, b) => b.length - a.length);

const smallTalkPattern = new RegExp("\\b(" + byLongestFirst.join("|") + ")\\b", "g");

export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function judgeInput(text) {
  const clean = normalize(text);

  if (clean === "") return "empty";

  const leftover = clean.replace(smallTalkPattern, " ").replace(/\s+/g, " ").trim();

  if (leftover === "") return "small_talk";

  return "ok";
}