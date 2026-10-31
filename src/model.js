import { config } from "./config.js";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Problems worth trying a second time. A wrong key or a wrong model name will
// fail again, so those are not on the list.
const RETRYABLE = new Set(["rate_limit", "server", "timeout", "network"]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// An error that carries a "kind", so other files can react to the kind
// instead of reading the message text.
export class ModelError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind;
  }
}

function errorForStatus(status) {
  if (status === 400 || status === 401 || status === 403) {
    return new ModelError(
      "refused",
      `The model refused the request (status ${status}). Check your API key.`
    );
  }
  if (status === 404) {
    return new ModelError(
      "bad_model",
      `The model "${config.model}" was not found (status 404). Check its name.`
    );
  }
  if (status === 429) {
    return new ModelError("rate_limit", "Too many requests. The free tier has limits.");
  }
  if (status >= 500) {
    return new ModelError("server", `The model's server had a problem (status ${status}).`);
  }
  return new ModelError("unexpected", `Unexpected status ${status}.`);
}

async function callOnce(prompt, apiKey, options) {
  const url = `${API_BASE}/${config.model}:generateContent`;

  const body = { contents: [{ parts: [{ text: prompt }] }] };
  if (options.system) {
    body.systemInstruction = { parts: [{ text: options.system }] };
  }
  if (options.json) {
    body.generationConfig = { responseMimeType: "application/json" };
  }

  let response;
 
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
     body: JSON.stringify(body),
      signal: AbortSignal.timeout(config.timeoutMs),
    });
  } catch (err) {
    if (err.name === "TimeoutError") {
      throw new ModelError("timeout", "The model took too long to answer.");
    }
    throw new ModelError("network", "Could not reach the model. Is the internet on?");
  }

  if (!response.ok) {
    throw errorForStatus(response.status);
  }

  const data = await response.json().catch(() => null);
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new ModelError("empty", "The model sent back no text.");
  }

  return text;
}

export async function askModel(prompt, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ModelError("no_key", "GEMINI_API_KEY is not set. See .env.example.");
  }

  try {
    return await callOnce(prompt, apiKey, options);
  } catch (err) {
    if (err instanceof ModelError && RETRYABLE.has(err.kind)) {
      await wait(config.retryDelayMs);
      return await callOnce(prompt, apiKey , options);
    }
    throw err;
  }
}