module.exports = {
  apps: [
    {
      name: "epoch-monitor",
      script: "src/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },

      // Basic restart protection
      max_restarts: 5,
      min_uptime: '10s',  // Must run 10s to count as successful start
      restart_delay: 4000,

      max_memory_restart: "500M",
    },
  ],
};
