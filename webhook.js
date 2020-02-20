const secret = "secret";
const repo = "~/cxui-framework/"; // Update this path to the repo path on remote

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

function getTime() {
      const date = new Date;
      return date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
}

let STAGE = 'Webhook'
const print = (msg) => `${STAGE} ${getTime()} msg`;

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

