/*
 * Steps to install webhook (from https://www.digitalocean.com/community/tutorials/how-to-use-node-js-and-github-webhooks-to-keep-remote-projects-in-sync)
 * 0. Add webhook on github pointing to server url
 * 1. Paste unique secret into github hook and this file
 * 2. Create this file at `/etc/systemd/system/webhook.service`
 * ```
 * [Unit]
 * Description=Github webhook
 * After=network.target
 *
 * [Service]
 * Environment=NODE_PORT=8080
 * Type=simple
 * User=sammy
 * ExecStart=/usr/bin/nodejs /path/to/webhook.js
 * Restart=on-failure
 *
 * [Install]
 * WantedBy=multi-user.target
 * ```
 * 3. Enable the webhook service: `systemctl enable webhook.service`
 * 4. Start the service: `systemctl start webhook`
 * 5. Check status with: `systemctl status webhook`
 * 6. Redeliver the webhook payload on github to test
 * 7. Success!
 *
 * If this webhook service keeps failing try moving `webhook.js` outside the repository directory
 * and update the path in `/etc/systemd/system/webhook.service`.
 * */

const secret = "SECRET_STRING";
const repo = "~/cxui-framework/"; // Update this path to the repo path on remote

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

function getTime() {
      const date = new Date;
      return date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
}

let STAGE = 'Webhook'
const print = (msg) => { console.log(`${STAGE} ${getTime()} ${msg}`); }

print('Starting server')
http.createServer(function (req, res) {
      req.on('data', function (chunk) {
                let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

                print('Got request');
                print('Data: ' + chunk);
                if (req.headers['x-hub-signature'] == sig) {
                              print('Running script')
                              exec(`cd ${repo}/scripts && ./build-on-remote.sh`);
                          }
            });

      res.end();
}).listen(8080);

