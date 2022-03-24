import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { nodeCrypto, Random } from "random-js";

import {
  botSummons,
  sadWords,
  starterEncouragements,
  starterGreetings,
  // eslint-disable-next-line import/no-unresolved
} from "./constants";

dotenv.config({ path: `${__dirname}/../.env` });

const { DISCORD_TOKEN } = process.env;

const random = new Random(nodeCrypto);

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: [
    "USER",
    "CHANNEL",
    "GUILD_MEMBER",
    "MESSAGE",
    "REACTION",
    "GUILD_SCHEDULED_EVENT",
  ],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Encourage bot is ready.");
});

const botSummonsRegex = new RegExp(botSummons.join("|"), "gim");
const sadWordsRegex = new RegExp(sadWords.join("|"), "gim");
const messageMatched = (content: string, pattern: RegExp) => {
  const parts = content.split(pattern);
  return parts.length > 1;
};
client.on("messageCreate", async (message) => {
  const { content } = message;
  if (message.author.bot) {
    // Don't talk to itself or other bots
    return;
  }
  if (messageMatched(content, botSummonsRegex)) {
    if (messageMatched(content, sadWordsRegex)) {
      const randomEncouragement =
        starterEncouragements[
          random.integer(0, starterEncouragements.length - 1)
        ];
      message.channel.send(randomEncouragement);
      return;
    }
    const randomGreeting =
      starterGreetings[random.integer(0, starterGreetings.length - 1)];
    message.channel.send(randomGreeting);
  }
});

// Login to Discord with your client's token
client.login(DISCORD_TOKEN);
