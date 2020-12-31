require("dotenv").config();
const secret = process.env.GITHUB_WEBHOOK_SECRET;
const repo = process.env.REPO_TO_UPDATE;
const PORT = process.env.GITHUB_WEBHOOK_PORT;

const http = require("http");
const crypto = require("crypto");
const exec = require("child_process").exec;

http
  .createServer(function (req, res) {
    req.on("data", function (chunk) {
      console.log("chunk --->", chunk.toString())
      let sig =
        "sha1=" +
        crypto
          .createHmac("sha1", secret)
          .update(chunk.toString())
          .digest("hex");
      console.log("sig --->", sig)
      if (req.headers["x-hub-signature"] == sig) {
        console.log("We are about to deploy")
        exec(`cd ${repo} && ./deploy.sh`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
      }
    });
    res.end();
  })
  .listen(PORT);
