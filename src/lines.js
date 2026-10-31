// Everything the ghost says without the AI lives here.
// Each entry can name a sound file (sounds/<name>.wav). If the file does not
// exist, the line is simply silent.

export const startupWarning =
  "Spooky tone only. No real horrors, just bad deployments. Use --mute to silence the ghost.";

export const emptyInputLines = [
  { text: "The ghost is waiting... ask it something.", sound: "intro-1" },
  { text: "Silence fills the terminal. Speak a question, mortal.", sound: "intro-2" },
  { text: "Your cursor blinks. I am patient. I have all of eternity.", sound: "intro-3" },
];

export const smallTalkReplies = [
  {
    text: "I do not do small talk, mortal. The dead have no time for pleasantries.",
    follow_up: "Tell me instead... what is the difference between a process and a thread?",
    sound: "dodge-1",
  },
  {
    text: "Hello? Hello? Only bugs answer to that name here.",
    follow_up: "Why does 0.1 + 0.2 not equal 0.3 in JavaScript?",
    sound: "dodge-2",
  },
  {
    text: "Your greeting echoes through the empty server room and finds nothing.",
    follow_up: "What really happens between typing a URL and seeing the page?",
    sound: "dodge-3",
  },
];

export const offTopicReplies = [
  {
    text: "That question belongs to the living. I only haunt code.",
    follow_up: "Tell me instead... what happens to memory when a program forgets to free it?",
    sound: "offtopic-1",
  },
  {
    text: "The spirits cannot see that far. My vision ends where the source code does.",
    follow_up: "What is the difference between a compiler and an interpreter?",
    sound: "offtopic-2",
  },
  {
    text: "I wander servers, not kitchens, nor anything else mortal.",
    follow_up: "Why do two requests sometimes see different data from the same database?",
    sound: "offtopic-3",
  },
];

// Used when the AI cannot be reached, or its reply fails the checker.
export const fallbackReplies = [
  {
    text: "The spirits are restless tonight and will not speak. Even ghosts have bad connections.",
    follow_up: "While we wait... what is the difference between latency and bandwidth?",
    sound: "fallback-1",
  },
  {
    text: "A cold wind blows through the wires, and your answer is lost in it.",
    follow_up: "What does a timeout protect a program from?",
    sound: "fallback-2",
  },
  {
    text: "The old server groans and falls silent. I cannot reach the other side.",
    follow_up: "Why should a program retry a failed request only a limited number of times?",
    sound: "fallback-3",
  },
];

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}