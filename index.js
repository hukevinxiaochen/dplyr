require('dotenv').config();
const secret = process.env.GITHUB_WEBHOOK_SECRET;
const repo = process.env.REPO_TO_UPDATE;

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

http.createServer(function (req, res) {
  console.log(req.headers);
  req.on('data', function(chunk) {
    let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');
    if (req.headers['x-hub-signature'] == sig) {
      console.log("Signature validated as a POST from github")
      console.log("Attempting a git pull")
      exec('cd ' + repo + ' && git pull');
    }
  });
  res.end();
}).listen(5409);
