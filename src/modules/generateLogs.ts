import { readFile, unlink } from "fs/promises";
import { join } from "path";

import { MessageAttachment } from "discord.js";

import { Camperbot } from "../interfaces/Camperbot";
import { errorHandler } from "../utils/errorHandler";

/**
 * To run when a private channel is closed. Finds the channel log file,
 * creates a message attachement with the logs, and deletes the file.
 *
 * @param {Camperbot} Bot The bot's Discord instance.
 * @param {string} channelId The channel ID of the private channel.
 * @returns {Promise<MessageAttachment>} The log file as a Discord attachment.
 */
export const generateLogs = async (
  Bot: Camperbot,
  channelId: string
): Promise<MessageAttachment> => {
  try {
    const logName = Bot.private_logs[channelId];
    delete Bot.private_logs[channelId];

    const logs = await readFile(
      join(process.cwd(), "logs", `${logName}.txt`),
      "utf8"
    ).catch(() => "no logs found...");

    const attachment = new MessageAttachment(
      Buffer.from(logs, "utf-8"),
      "log.txt"
    );

    await unlink(join(process.cwd(), "logs", `${logName}.txt`));

    return attachment;
  } catch (err) {
    await errorHandler(Bot, err);
    return new MessageAttachment(
      Buffer.from("An error occurred fetching these logs.", "utf-8"),
      "log.txt"
    );
  }
};
