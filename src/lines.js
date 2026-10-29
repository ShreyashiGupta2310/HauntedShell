export const startupWarning ="Spooky tone only. No real horrors, just bad deployments.";
export const emptyInputLines = [
  "The ghost is waiting... ask it something.",
  "Silence fills the terminal. Speak a question, mortal.",
  "Your cursor blinks. I am patient. I have all of eternity.",
];

export const smallTalkReplies = [
  {
    text: "I do not do small talk, mortal. The dead have no time for pleasantries.",
    follow_up: "Tell me instead... what is the difference between a process and a thread?",
  },
  {
    text: "Hello? Hello? Only bugs answer to that name here.",
    follow_up: "Why does 0.1 + 0.2 not equal 0.3 in JavaScript?",
  },
  {
    text: "Your greeting echoes through the empty server room and finds nothing.",
    follow_up: "What really happens between typing a URL and seeing the page?",
  },
];
export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}