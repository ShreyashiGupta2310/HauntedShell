import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// These tests run the real program like a user would. None of them touch the
// network: they only use paths that never call the AI.
const binFile = fileURLToPath(new URL("../bin/hauntedshell.js", import.meta.url));

function runCli(args) {
  return spawnSync(process.execPath, [binFile, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
}

test("--help prints usage and exits normally", () => {
  const result = runCli(["--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /--offline/);
});

test("an unknown flag prints a clear message and exits with code 1", () => {
  const result = runCli(["--summon-demons"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown option/);
  assert.match(result.stderr, /Usage:/);
});

test("no question shows the banner and the safety note", () => {
  const result = runCli([]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Spooky tone only/);
});

test("small talk gets a dodge that ends with a question", () => {
  const result = runCli(["hey what's up"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /\?\s*$/);
});

test("--offline answers without any AI, with a question at the end", () => {
  const result = runCli(["--offline", "what is a thread"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /\?\s*$/);
});

test("--mute is accepted together with other flags", () => {
  const result = runCli(["--mute", "--offline", "what is a thread"]);
  assert.equal(result.status, 0);
});