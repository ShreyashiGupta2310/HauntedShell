### Step 1: Project skeleton (Oct 28)

**What I built**
The smallest version of HauntedShell that actually runs. I type
`hauntedshell hello there` and it prints `You asked: hello there`.
It has four files:
- `package.json`: the project's ID card (name, commands, settings)
- `bin/hauntedshell.js`: the file the terminal starts
- `src/cli.js`: where the real work will live
- `.gitignore`: a list of files Git must never upload

**Why the starting file is so small**
`bin/hauntedshell.js` only starts the program. All the logic lives in
`src/cli.js`. I did this so my tests can later use the logic without
launching the whole program. (This is called separating the entry point
from the logic.)

**How the command works**
The first line, `#!/usr/bin/env node`, tells the operating system to run
the file with Node. (It's called a shebang.) The `bin` field in
`package.json` connects a command name to that file. `npm link` makes a
shortcut to my folder, not a copy, so my edits work instantly.

**How it reads my words**
`process.argv` is the list of everything I typed. The first two items are
Node's own path and my file's path, so my words start at position 2.
`.slice(2)` skips those two. `.join(" ")` glues the words back into one
sentence, so I don't need quotes around my question.

