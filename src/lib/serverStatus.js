import net from "net";
import logger from "./logger.js";

const server = "game.project-epoch.net";
const delaySeconds = 8;

const monitoredPorts = [
  { port: 3724, label: "Auth server" },
  { port: 8085, label: "Kezan" },
  { port: 8086, label: "Gurubashi" }
];

const emojiMap = {
  "Gurubashi_ONLINE": "<a:NOWAYING:1307834547274121297>",
  "Gurubashi_OFFLINE": "<a:peace_out:834742726008373289>",
  "Kezan_ONLINE": "<a:humanmale:790940951249158164>",
  "Kezan_OFFLINE": "<:pepepoint:947479443402788895>",
  "Auth server_ONLINE": "<a:owN:887489983542341693>",
  "Auth server_OFFLINE": "<:britbong:798931087853486111>",
};

const lastStatusMap = new Map();

function isPortOpen(host, port, timeout = 2000) {
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

async function sendStatusMessage(channel, roleId, label, status) {
  const key = `${label}_${status}`;
  const emoji = emojiMap[key] || "";
  // Only ping role if Gurubashi went ONLINE
  const shouldPing = label === "Gurubashi" && status === "ONLINE";
  const rolePing = shouldPing && roleId ? ` <@&${roleId}>` : "";
  const msg = `${emoji}${rolePing} ${label} went **${status}** ${emoji}`;

  logger.info(msg);
  await channel.send(msg);
}

export async function monitorServerStatus(discordChannel, roleId) {
  async function check() {
    for (const { port, label } of monitoredPorts) {
      const isUp = await isPortOpen(server, port);
      const status = isUp ? "ONLINE" : "OFFLINE";
      const lastStatus = lastStatusMap.get(port);

      if (lastStatus !== undefined && lastStatus !== status) {
        await sendStatusMessage(discordChannel, roleId, label, status);
      }

      lastStatusMap.set(port, status);
    }

    setTimeout(check, delaySeconds * 1000);
  }

  logger.info("Starting server port monitor...");
  check();
}
