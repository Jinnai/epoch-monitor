import fs from "fs/promises";
import logger from "./logger.js";
const filePath = "./guildSettings.json";

async function loadStore() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveStore(store) {
  await fs.writeFile(filePath, JSON.stringify(store, null, 2));
}

export async function saveChannelForGuild(guildId, channelId) {
  const store = await loadStore();
  store[guildId] ??= {};
  store[guildId].channelId = channelId;
  await saveStore(store);
}

export async function saveRoleForGuild(guildId, roleId) {
  const store = await loadStore();
  store[guildId] ??= {};
  store[guildId].roleId = roleId;
  await saveStore(store);
}

export async function clearRoleForGuild(guildId) {
  const store = await loadStore();
  if (store[guildId]) {
    delete store[guildId].roleId;
    await saveStore(store);
  }
}

export async function saveTrackedServersForGuild(guildId, servers) {
  const store = await loadStore();
  store[guildId] ??= {};
  store[guildId].trackedServers = servers;
  await saveStore(store);
}

export async function getTrackedServersForGuild(guildId) {
  const store = await loadStore();
  return store[guildId]?.trackedServers ?? ["GURUBASHI"];
}

export async function getAllSettings(client) {
  const store = await loadStore();
  const results = [];

  for (const guildId in store) {
    const channelId = store[guildId].channelId;
    const roleId = store[guildId].roleId;
    try {
      const guild = await client.guilds.fetch(guildId);
      const channel = await guild.channels.fetch(channelId);
      if (channel && channel.isTextBased()) {
        results.push({ channel, roleId });
      }
    } catch (err) {
      logger.warn(`Could not fetch channel for guild ${guildId}:`, err.message);
    }
  }

  return results;
}
