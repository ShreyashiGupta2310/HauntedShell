import { test } from "node:test";
import assert from "node:assert/strict";
import { playSound, soundPath } from "../src/sound.js";

test("no sound name means silence", () => {
  assert.equal(playSound(undefined), false);
});

test("muted means silence", () => {
  assert.equal(playSound("dodge-1", { mute: true }), false);
});

test("a sound file that does not exist is silently skipped", () => {
  assert.equal(playSound("this-file-does-not-exist"), false);
});

test("sound files are looked up inside the sounds folder", () => {
  assert.match(soundPath("dodge-1"), /sounds[\\/]dodge-1\.wav$/);
});