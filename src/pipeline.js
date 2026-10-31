import { askModel, ModelError } from "./model.js";
import { ghostSystemPrompt, buildUserMessage } from "./prompts.js";
import { checkReply } from "./checker.js";
import { offTopicReplies, fallbackReplies, pick } from "./lines.js";
import { debug } from "./debug.js";

// Problems the user has to fix themselves (key, model name). Everything else
// is temporary, so the ghost covers for it with a pre-written line.
const SETUP_PROBLEMS = new Set(["no_key", "refused", "bad_model"]);

// A pre-written reply. "source" says why it was used: "fallback" or "offline".
export function fallbackReply(source = "fallback") {
  return { source, topic: null, ...pick(fallbackReplies) };
}

function parseReply(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ModelError("bad_reply", "The spirits spoke, but I could not read their words.");
  }
  // JSON.parse("42") or JSON.parse("null") works, but is not a reply object.
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new ModelError("bad_reply", "The spirits spoke, but not in the shape I expected.");
  }
  return parsed;
}

// One question in, one finished reply out: { source, topic, text, follow_up }
// source is "ai", "dodge" or "fallback".
export async function haunt(question) {
  const started = performance.now();

  try {
    const raw = await askModel(buildUserMessage(question), {
      system: ghostSystemPrompt,
      json: true,
    });
    debug(`model answered in ${Math.round(performance.now() - started)} ms`);

    const reply = parseReply(raw);

    // Only an explicit false means "not about software". A missing value is a
    // malformed reply, which the checker below will catch.
    if (reply.on_topic === false) {
      return { source: "dodge", topic: null, ...pick(offTopicReplies) };
    }

    const verdict = checkReply(reply);
    if (!verdict.ok) {
      debug("checker rejected the reply:", verdict.problems.join("; "));
      return fallbackReply("fallback");
    }

    return {
      source: "ai",
      topic: verdict.reply.topic,
      text: verdict.reply.spooky_answer,
      follow_up: verdict.reply.follow_up,
    };
  } catch (err) {
    if (err instanceof ModelError && !SETUP_PROBLEMS.has(err.kind)) {
      debug(`${err.kind}: ${err.message}`);
      return fallbackReply("fallback");
    }
    throw err;
  }
}