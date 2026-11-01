# Decisions

For each choice: what I chose, what else I looked at, why, and what happened.

## D1. A command-line tool, not a web app
Developers already live in the terminal, the theme ("ghost in the machine") fits, and it was small enough to understand fully as my first CLI. The cost is less visual polish. **What happened:** it worked, and it taught me flags, exit codes and input/output.

## D2. Node.js with almost no libraries
I used what Node already has: `fetch`, `util.parseArgs`, `node:test`, `process.loadEnvFile`. There are no runtime dependencies. The cost is that I wrote small helpers (colors, typing effect) by hand. **What happened:** fewer things I cannot explain.

## D3. Hosted Gemini, behind one file
I looked at local Gemma through Ollama and hosted Gemini. I chose hosted Gemini because my laptop has 8 GB of RAM and slowed down badly on an earlier project. The cost is needing internet, an API key, and free-tier limits. **What happened:** the first real call worked. I never ran a RAM check or tried Gemma, so the 8 GB worry is a judgement, not a measurement. Only `model.js` talks to Gemini, so switching later is a one-file change.

## D4. The bouncer is plain code, not AI
It is free, instant, works offline, and cannot be talked into anything. It only blocks a message made entirely of small talk, because wrongly blocking a real question is worse than letting small talk through. The cost is that some small talk gets through to the AI, which then answers or dodges. **What happened:** 6 tests pass. I have not tried it on a large set of inputs.

## D5. One AI call, not two
I first planned two calls: one for correct facts, one to make it spooky. I chose one call because of the deadline. The cost is that style and facts compete inside one prompt. To protect the facts, the AI also lists its key technical terms, and the checker makes sure at least half survive in the spooky answer. **What happened:** it works. I did not build or measure the two-call version.

## D6. JSON replies, checked by code
JSON lets code verify the reply instead of guessing. The checker looks at the shape, the length, the follow-up question, banned wording and the key terms. The cost is that models sometimes break JSON, and a good answer can be rejected for using a synonym. **What happened:** the 3 real replies I tried after connecting it all passed.

## D7. Setup problems are shown, temporary problems are hidden
No key, a wrong key, or a wrong model name can only be fixed by me, so they print a clear message and exit with code 1. Network trouble, timeouts, rate limits and strange replies are temporary, so a pre-written ghost line covers for them (after one retry where it makes sense). **What happened:** tested with fakes and with real Wi-Fi turned off.

## D8. `--offline` means pre-written lines, not an offline AI
It prints one of the ghost's fixed lines. It is for demos with no internet and for people without a key. It does not run any model, and I do not describe it as offline AI.

## D9. Voice from the built-in Windows voice, made ahead of time
The voice files are made once with `npm run voices` and played from `sounds/`. That is reliable, free at runtime, and needs no extra service. I slowed the voice down to sound creepier. I tried Audacity effects but could not get them working in time. The files are committed so people on other systems can hear them. I have not checked Microsoft's terms for sharing audio made with its voices.

## D10. Tests with a fake Gemini, plus tests of the real command
The fake means tests need no internet or key, and give the same result every time. A second group runs the real program as a child process and checks its output and exit code. **What happened:** 36 tests pass.

## D11. An original spooky theme
No copyrighted names, characters, spells or film sounds. I first thought about a castle feel and dropped it to keep the theme simple and safe for an open-source repo.

## D12. Secrets only in `.env`
`.env` is ignored by git from the first commit, and `.env.example` shows the shape. `git status` never listed `.env`.

## D13. The treasure-hunt idea is parked
My idea: after you answer the ghost, it points you to a section of the official docs to read, and rewards a good answer. It needs a conversation loop, hand-checked docs links, and a way to judge free-text answers. Not realistic by the deadline, so it is in the README as a future idea. The reply already carries a `topic` field so it can attach later.

## D14. No Gemma yet
The Gemma prize category fits the project's idea of swapping models, but I did not use Gemma. It is listed as a future experiment.