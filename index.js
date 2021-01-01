require("dotenv").config();
const secret = process.env.GITHUB_WEBHOOK_SECRET;
const repo = process.env.REPO_TO_UPDATE;
const PORT = process.env.GITHUB_WEBHOOK_PORT;

const http = require("http");
const crypto = require("crypto");
const exec = require("child_process").exec;
const appendFile = require("fs").appendFile;

http
  .createServer(function (req, res) {
    const log = [];
    req.on("data", function (chunk) {
      log.push(`data event fired, here's the chunk ---> ${chunk.toString()}`);
      console.log(log[0]);
      let sig =
        "sha1=" +
        crypto
          .createHmac("sha1", secret)
          .update(chunk.toString())
          .digest("hex");
      log.push(`sig ---> ${sig}`);
      if (req.headers["x-hub-signature"] == sig) {
        log.push("Sig validated as coming from Github, we are about to deploy");
        exec(`cd ${repo} && ./deploy.sh`, (error, stdout, stderr) => {
          if (error) {
            log.push(`exec error: ${error}`);
            console.error(`exec error: ${error}`);
            appendFile("./log.txt", `${log.join("\n")}\n`, (err) => {
              console.error(err);
            });
            return;
          }
          log.push(`stdout: ${stdout}`);
          console.log(`stdout: ${stdout}`);
          log.push(`stderr: ${stderr}`);
          console.error(`stderr: ${stderr}`);
          appendFile("./log.txt", `${log.join("\n")}\n`, (err) => {
            console.error(err);
          });
        });
      }
    });
    res.end();
  })
  .listen(PORT);
