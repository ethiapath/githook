const secret = "SECRET";
const repo = ~/cxui-framework/;

const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

function getTime () {
          const date = new Date;
          return date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
}

// var logFile = fs.createWriteStream('/tmp/githook.log', {flags: 'a'});

// process.stdout.write = process.stderr.write = logFile.write.bind(logFile);

/*
process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});
*/

console.log('[Webhook] ' + getTime() + ' Starting server')
http.createServer(function (req, res) {
            req.on('data', function(chunk) {
                            let sig = sha1= + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

                            console.log('[Webhook] ' + getTime() + ' Got request');
                            console.log('[Webhook] ' + getTime() + ' Date: ' + chunk);
                            if (req.headers['x-hub-signature'] == sig) {
                                                console.log('[Webhook] ' + getTime() + '  Running script')
                                                let buildScript = exec('cd ' + repo + ' && ./scripts/build-on-remote.sh');
                                                // buildScript.stdout.pipe(logFile);
                                                // buildScript.stderr.pipe(logFile);
                                                console.log('[Webhook] ' + getTime() + '  Script completed!')
                                            }
                        });

            res.end();
}).listen(8080);

