import net from "net";
import { getRoleIdForGuild, getTrackedServersForGuild } from "./guildStore.js";
import logger from "./logger.js";

const server = "game.project-epoch.net";
const delaySeconds = 12;

const monitoredPorts = [
  { port: 3724, label: "AUTH" },
  { port: 8085, label: "KEZAN" },
  { port: 8086, label: "GURUBASHI" }
];

const labelMap = {
  AUTH: "Auth server",
  KEZAN: "Kezan",
  GURUBASHI: "Gurubashi"
};

const emojiMap = {
  GURUBASHI_ONLINE: "<a:NOWAYING:1307834547274121297>",
  GURUBASHI_OFFLINE: "<a:peace_out:834742726008373289>",
  KEZAN_ONLINE: "<a:humanmale:790940951249158164>",
  KEZAN_OFFLINE: "<:pepepoint:947479443402788895>",
  AUTH_ONLINE: "<a:owN:887489983542341693>",
  AUTH_OFFLINE: "<:britbong:798931087853486111>"
};

const monitorIntervals = new Map(); // guildId -> timeout handle
const lastStatusMap = new Map(); // guildId -> Map(port, status)

function isPortOpen(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeout);
    socket.once("connect", () => {
      isConnected = true;
      socket.destroy();
    });
    socket.once("timeout", () => socket.destroy());
    socket.once("error", () => {}); // ignore errors
    socket.once("close", () => resolve(isConnected));

    socket.connect(port, host);
  });
}

function getRolePing(label, status, roleId, guildId) {
  let rolePing = "";

  // Only ping role if GURUBASHI went ONLINE
  const shouldPing = label === "GURUBASHI" && status === "ONLINE";

  if (shouldPing && roleId) {
    rolePing = roleId === guildId ? " @everyone" : ` <@&${roleId}>`;
  }

  return rolePing;
}

async function sendStatusMessage(channel, roleId, label, status) {
  const guild = channel.guild;
  const key = `${label}_${status}`;
  const emoji = emojiMap[key] || "";
  const displayLabel = labelMap[label] || label;
  const rolePing = getRolePing(label, status, roleId, guild.id);
  const msg = `${emoji}${rolePing} ${displayLabel} went **${status}** ${emoji}`;

  logger.info(`${guild.name}: ${msg}`);
  await channel.send(msg);
}

export async function monitorServerStatus(channel) {
  const guildId = channel.guild.id;

  // Stop any existing monitor for this guild
  if (monitorIntervals.has(guildId)) {
    clearTimeout(monitorIntervals.get(guildId));
    monitorIntervals.delete(guildId);
  }

  async function check() {
    let guildStatus = lastStatusMap.get(guildId);
    if (!guildStatus) {
      guildStatus = new Map();
      lastStatusMap.set(guildId, guildStatus);
    }

    const trackedServers = await getTrackedServersForGuild(guildId);

    for (const { port, label } of monitoredPorts) {
      if (!trackedServers.includes(label)) {
        continue;
      }

      const isUp = await isPortOpen(server, port);
      const status = isUp ? "ONLINE" : "OFFLINE";
      const lastStatus = guildStatus.get(port);

      if (lastStatus !== undefined && lastStatus !== status) {
        const roleId = await getRoleIdForGuild(guildId);
        await sendStatusMessage(channel, roleId, label, status);
      }

      guildStatus.set(port, status);
    }

    // Store the timeout handle so it can be cleared later
    const timeout = setTimeout(check, delaySeconds * 1000);
    monitorIntervals.set(guildId, timeout);
  }

  logger.info("Starting server port monitor...");
  check();
}
