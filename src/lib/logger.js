import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true }
      }
    ]
  }
});
export default logger;
