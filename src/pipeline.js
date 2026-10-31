import { askModel, ModelError } from "./model.js";
import { ghostSystemPrompt, buildUserMessage } from "./prompts.js";
import { offTopicReplies, pick } from "./lines.js";

function parseReply(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new ModelError("bad_reply", "The spirits spoke, but I could not read their words.");
  }
}

// One question in, one finished reply out:
// { source, topic, text, follow_up }
export async function haunt(question) {
  const raw = await askModel(buildUserMessage(question), {
    system: ghostSystemPrompt,
    json: true,
  });

  const reply = parseReply(raw);

  if (!reply.on_topic) {
    const dodge = pick(offTopicReplies);
    return { source: "dodge", topic: null, text: dodge.text, follow_up: dodge.follow_up };
  }

  return {
    source: "ai",
    topic: reply.topic,
    text: reply.spooky_answer,
    follow_up: reply.follow_up,
  };
}