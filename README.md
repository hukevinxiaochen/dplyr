# Github Webhook Server

Assuming:

- A Github webhook configured with:
  - Endpoint of form `http://<domain>.<tld>:<custom_port>`
  - Payload of type `application/json`
  - Secret that is to be sent (hashed) in the Header under `X-Hub-Signature` and `X-Hub-Signature-256`

- A server with directories housing remote repositories that we want to 
  respond to webhooks being triggered by running deployment commands like:
  `git pull` or `npm run build`.

- The server on which we wish to run this has `node` installed.
- The user who will run this server process has permissions to run commands
 in whatever the target directories are.
- The server is allowing TCP connections on the `custom_port`

This application can:

- Listen on `<custom_port>`
- Verify that requests are being sent from Github by using the `X-Hub-Signature` header.
- Execute arbitrary shell commands for verified webhook requests.
- Logs out shell command error and success messages.

## Configuring the Server

### Put secrets in a .env file

Secrets that need configuring for this application to work are:

- `GITHUB_WEBHOOK_PORT` - just has to be available for use on the server this app is running on.
- `GITHUB_WEBHOOK_SECRET` - you decide this when you create the webhook in Github.
- `REPO_TO_UPDATE` - a path to the directory in which you want a command
 to be run.

## Running the Server

To run the server while you're SSH'd into the server, one just needs to:

- Run this module with a quick `node index.js`

### Configure this to run with systemd as process manager

Systemd is available on many Linux distributions as a process manager and init system that will keep this server running through shutdowns and allows you to walk away and terminate your SSH and shell session knowing that this server will be up and running, ready to go.

Example configuration file for systemd to be placed in `/etc/systemd/system`.

Name it `something.service`.

```
 [Unit]
Description=A server listening for Git webhooks to deploy apps
After=network.target
[Service]
User=www-data
WorkingDirectory=/var/www/personal
ExecStart=<PATH_TO_NODE_EXECUTABLE> /var/www/dplyr/index.js
Restart=always
RestartSec=500ms
StartLimitInterval=0
[Install]
WantedBy=multi-user.target
```

- Reload systemd configuration `systemctl daemon-reload`
- Enable the new unit `systemctl enable something`
- Start the new unit `systemctl start something`
- Troubleshoot as needed `systemctl status something.service` and `sudo journalctl -u something`

### Configure this to have requests proxied to it via NGINX

Allows for using the rate limit module required for throttling requests.

### TODO: Configure to ensure some throttling of requests

My small server does not have huge capacity so it should have a way to throttle requests. This would protect against abuse of the Webhook endpoint too.

## Resources

- [Github Docs| Webhooks](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/securing-your-webhooks)
