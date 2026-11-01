# What I learned (28 oct --> 1 nov (before the deadline))

HauntedShell is my first command-line tool. I built it in a few days at the end of October 2026, one small step at a time, with an AI assistant explaining each file.

## The ideas that stuck

1. **A command is just a program the terminal starts.** The first line of `bin/hauntedshell.js`, `#!/usr/bin/env node` (a shebang), says "run this with Node". The `bin` field in `package.json` gives the command its name. `npm link` makes a shortcut to my folder, so my edits work straight away.
2. **My words arrive in `process.argv`.** The first two items are Node's own path and my file's path, so my question starts at position 2. For flags like `--offline` I use Node's built-in `util.parseArgs`.
3. **Keep the starting file tiny.** The real work lives in `src/`, so tests can import it without launching the program.
4. **One file, one job.** `bouncer.js` filters input, `model.js` is the only file that talks to Gemini, `checker.js` inspects replies, `lines.js` holds the ghost's words, `display.js` handles how it looks. When something breaks, I know where to look.
5. **Never trust an AI reply.** It can be too long, broken, or off-tone. I ask for JSON, check it in code, and if anything is wrong a pre-written ghost line is shown instead.
6. **Two kinds of problems.** Setup problems (no key, wrong key, wrong model name) are shown clearly, because only I can fix them. Temporary problems (no internet, timeout, rate limit, strange reply) are hidden behind a ghost line, and the real reason shows in debug mode.
7. **`fetch` does not throw on a 404.** It only throws when no reply arrives at all. A 404 or 429 is still a reply, so I check `response.ok` myself.
8. **Keep secrets out of git.** The key lives in `.env`, `.gitignore` blocks it, and `.env.example` shows the shape. `config.js` finds `.env` from its own location, so the command works from any folder.
9. **Test with a fake.** My tests swap `fetch` for a fake Gemini, so they need no internet or key. A second group runs the real command as a child process and checks what it prints and its exit code.
10. **Pick the cheaper mistake.** In the bouncer, blocking a real question is worse than letting small talk through. So it only blocks a message that is made entirely of small talk.
11. **Exit codes mean something.** `0` is a normal finish (even with a fallback line). `1` means misuse or a setup problem.
12. **Rules and question go in separate places.** The ghost's rules go in a system instruction, and the question is wrapped in `<question>` tags as data. This lowers the risk of prompt injection, but it does not remove it.

## Mistakes I made

1. **A broken paste in `model.js`.** Node said `Unexpected token 'export'` and pointed at line 3, but the real problem was above it. `node --check src/model.js` finds syntax errors without running the program. I fixed it by clearing the file and pasting it again.
2. **New code pasted on top of old code.** In `typeOut`, I ended up with two loops, so every answer printed twice, and the color reset and new line were gone. The tests could not catch it because they run without a real terminal. I found it by running the real command. Lesson: when I change a function, replace the whole function and check its start and its end.
3. **I committed late.** I finished steps 4 and 5 before committing, and had to split the work into one-file commits afterwards. Lesson: commit after every working step.

## Words I now know

- **shebang:** the first line that says which program runs the file.
- **stdout / stderr:** the normal output channel and the error channel.
- **exit code:** the number a program returns when it ends. `0` means fine.
- **environment variable:** a setting that lives outside the code, like my API key.
- **async / await:** a way to wait for slow things (the internet) without freezing.
- **regex `\b`:** "a word edge", so "hi" does not match inside "this".
- **fake (in tests):** a stand-in for the real thing, like my fake Gemini.
- **prompt injection:** a user trying to override the AI's rules from inside their question.