# matrix-simple-backup

A CLI tool that backs up all messages in a matrix room to a newline-delimited JSON file.

Note that it does not backup any media or attachments, only text and state events.

Quick-and-dirty, written in one evening for my use-case, and contains no tests, so use at your own risk :)

## What you'll need

- Your matrix server hostname
- An access token (https://t2bot.io/docs/access_tokens)
- The room ID to back up

## Usage

```sh
# quick version
npx matrix-simple-backup path/to/output/file.ndjson

# or, pass in the params
npx matrix-simple-backup --host your.matrix.server.net --room !your-room-id:your.matrix.server.net --token super-secret-token path/to/output/file.ndjson

# see all options
npx matrix-simple-backup --help

# or, install it locally
npm i -g matrix-simple-backup

# and do same as above
matrix-simple-backup --help
```