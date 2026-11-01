# HauntedShell

A haunted terminal ghost that answers your developer questions correctly, in a spooky voice, and always asks one back.

Built for Hacktoberfest 2026, Week 4: "Ghost in the Machine".

```
$ hauntedshell "what is npm"

It is npm, the Node Package Manager that summons thousands of JavaScript
libraries into your vendor darkness. Through its command-line interface, it
fetches remote packages from the registry and binds them to your package.json
manifest. Beware, for nested dependencies sleep silently inside node_modules,
waiting to bloat your disk.

Have you audited the phantom scripts lurking deep within your package-lock.json
before running npm install at midnight?
```

<!-- Add your demo video here if you have one -->

## What it does

- Answers developer questions in an eerie voice, and keeps the facts correct.
- Ends every answer with a spooky question that makes you think.
- Refuses small talk. Say "hey, what's up" and the ghost drags you back to dev topics.
- Checks every AI reply before you see it. If the AI fails or sends something odd, a pre-written ghost line covers for it, and the program never shows a raw error.

## Quick start

You need Node.js 18 or newer (22 recommended) and a Gemini API key from Google AI Studio.

```
git clone https://github.com/ShreyashiGupta2310/HauntedShell.git
cd HauntedShell
copy .env.example .env        (Mac/Linux: cp .env.example .env)
```

Open `.env` and paste your key after `GEMINI_API_KEY=`. Then:

```
npm link
hauntedshell "what is a thread"
```

`npm link` installs two commands that point at this folder: `hauntedshell` and the short nickname `haunt`.

## Usage

```
hauntedshell "your question"     ask the ghost
hauntedshell                     summon the ghost (banner and a line)
hauntedshell --offline "..."     skip the AI and use the ghost's pre-written lines
hauntedshell --mute "..."        turn off sound
hauntedshell --help              show help
```

`--offline` does not use any AI. It prints one of the ghost's pre-written lines, so it works with no internet and no API key.

## How it works

```
question -> cli -> bouncer -> pipeline -> model (Gemini) -> checker -> display
                      |                                        |
                small talk / empty                      weak reply -> fallback line
```

1. **Bouncer** (plain code, no AI) stops empty input and pure small talk.
2. **Pipeline** asks Gemini for a JSON reply: a spooky answer, key technical terms, and a follow-up question. The rules go in a separate system instruction, and the user's question is wrapped as data.
3. **Checker** verifies the reply: valid shape, sensible length, exactly one follow-up question, no banned wording, and enough of the key terms still present.
4. If anything fails, a **pre-written ghost line** is printed instead. Setup problems (no key, wrong key, wrong model name) are shown clearly, because only you can fix them.

The model is called with plain `fetch` against the Gemini API, with a timeout and one retry for temporary problems.

## Safety

"Spooky" means eerie atmosphere about code: haunted servers, forgotten bugs, whispering logs. It never means gore, threats, or anything personal. The ghost has no access to your files or secrets. Layers: a startup note, an input length cap, the bouncer, prompt rules, the checker, and fallbacks. No layer is perfect, since a language model can still say something unexpected. The checker's word list is a starting point and will have misses.

## Configuration

Set these in `.env` or in your environment:

| Setting | Purpose |
|---|---|
| `GEMINI_API_KEY` | your Gemini API key (needed for real answers) |
| `HAUNTEDSHELL_MODEL` | which Gemini model to use |
| `HAUNTEDSHELL_DEBUG=1` | print timings and the real reason behind a fallback line |

Never commit `.env`. It is already in `.gitignore`.

## Sound

The ghost's fixed lines have voice files in `sounds/`, made with the built-in Windows voice at a slowed rate (`npm run voices` recreates them on Windows). Playback uses PowerShell on Windows, `afplay` on macOS and `aplay` on Linux. I have only tried it on Windows. Missing files are simply silent, and `--mute` turns sound off. A creepier voice is on the roadmap.

## Tests

```
npm test
```

36 automated tests cover the bouncer, the checker, the pipeline (including failures and retries), the sound helper, and the command line itself. The AI tests use a fake Gemini, so they need no internet and no key.

## Notes from testing

- Without rules, Gemini's first reply was long markdown with headings and a table, which is not usable in a terminal. A system prompt asking for short plain text fixed it.
- One real call took about 7 seconds (a single measurement, not an average).
- A copy-paste mistake once made every answer print twice. The tests could not catch it because they run without a real terminal. I found it by running the real command.
- [Add anything else you noticed.]

## Project structure

```
bin/hauntedshell.js     the file the terminal runs
src/cli.js              flags, input cleanup, printing
src/bouncer.js          small talk vs a real question
src/pipeline.js         ask, parse, check, fall back
src/model.js            the only file that talks to Gemini
src/prompts.js          the ghost's rules
src/checker.js          checks every AI reply
src/lines.js            pre-written ghost lines
src/display.js          colors, banner, typing effect
src/sound.js            plays voice files
test/                   automated tests
scripts/make-voices.js  makes the voice files (Windows)
```

## Ideas for later

- A treasure-hunt mode: after you answer the ghost's question, it points you to a section of the official docs to read, and rewards a good answer.
- Try Gemma in place of Gemini, and measure what changes.
- Split the AI step into "get the facts right" then "make it spooky", and measure whether accuracy improves.
- A creepier voice.


## License

MIT. See [LICENSE](LICENSE).

## Commits after the deadline
None so far. I will list any here.