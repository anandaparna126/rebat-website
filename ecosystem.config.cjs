// pm2 processes for the ReBAT website + admin panel. Both run on the nvm
// Node 22 (Next 16 needs >= 20.9); the system Node 18 is left for vcare.
// They listen on localhost only — nginx terminates HTTPS on the public
// ports (8011 -> 3011, 8013 -> 3013); see deploy/nginx-rebat.conf.
const NODE = "/home/ubuntu/.nvm/versions/node/v22.23.3/bin/node";

module.exports = {
  apps: [
    {
      name: "rebat-website",
      cwd: "/home/ubuntu/rebat",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3011 -H 127.0.0.1",
      interpreter: NODE,
      env: { NODE_ENV: "production", PORT: "3011" },
      max_memory_restart: "700M",
    },
    {
      name: "rebat-admin",
      cwd: "/home/ubuntu/rebat/admin-panel",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3013 -H 127.0.0.1",
      interpreter: NODE,
      env: { NODE_ENV: "production", PORT: "3013" },
      max_memory_restart: "400M",
    },
  ],
};
