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

## Configuring the Server

### TODO: Put secrets in a .env file

Secrets for this application are the `GITHUB_WEBHOOK_SECRET` and the 
`REPO_TO_UPDATE` (a path to the directory in which you want a command
 to be run).

## Running the Server

To run the server while you're SSH'd into the server, one just needs to:

- Run this module with a quick `node index.js`

### TODO: Configure this to run with systemd as process manager

Systemd is available on many Linux distributions as a process manager and init system that will keep this server running through shutdowns and allows you to walk away and terminate your SSH and shell session knowing that this server will be up and running, ready to go.

## Resources

- [Github Docs| Webhooks](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/securing-your-webhooks)
