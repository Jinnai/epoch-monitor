import net from "net";
import logger from "./logger.js";

const server = "game.project-epoch.net";
const delaySeconds = 8;

const monitoredPorts = [
  { port: 3724, label: "Auth server" },
  { port: 8085, label: "Kezan" },
  { port: 8086, label: "Gurubashi" },
];

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
  const rolePing = roleId ? ` <@&${roleId}>` : "";
  const msg = `🚨${rolePing} ${label} went **${status}** 🚨`

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
