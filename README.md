# matrix-simple-backup

A CLI tool that backs up all messages in a matrix room to a newline-delimited JSON file.

Quick-and-dirty, written in one evening for my use-case, and contains no tests, so use at your own risk :)

## Usage

```sh
# quick version
npx matrix-simple-backup --host your.matrix.server.net path/to/output/file.ndjson

# or, pass in the params
npx matrix-simple-backup --host your.matrix.server.net --room !your-room-id:your.matrix.server.net path/to/output/file.ndjson

# see all options
npx matrix-simple-backup --help
```