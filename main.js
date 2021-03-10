import yargs from 'yargs';
import axios from 'axios';
import prompt from 'prompt';
import { createWriteStream } from 'fs';
import { join } from 'path';

prompt.message = '';
prompt.delimiter = ' =>';

async function config () {
  const cli =
    yargs(process.argv.slice(2))
      .usage('Usage: $0 [options] <output>')
      .option('host', { description: 'Hostname of the matrix server'})
      .option('room', { description: 'Room ID to back up'})
      .option('token', { description: 'Access token (https://t2bot.io/docs/access_tokens)'})
      .demandCommand(1);

  const { argv, argv: { host, room, token } } = cli;
  const [ output ] = argv._;
  const userInput = [];
  let input;

  process.stdout.write('Hi, let\'s do this!\n');

  if (!host) userInput.push('host');
  if (!room) userInput.push('room');
  if (!token) userInput.push('token');

  prompt.start();

  if (userInput.length) {
    process.stdout.write('First, some questions:\n');
    try {
      input = await prompt.get(userInput);
    } catch(e) {
      process.stdout.write('\nOk, nevermind...\n\n');
      process.exit();
    }
  }

  return {
    host, room, token, output,
    ...input,
  }
}

function endpointPath (server, room) {
  let serverPath = /^https?\:\/\//.test(server) ? server : `https://${server}`;
  if (!/\/$/.test(serverPath)) serverPath += '/';

  return `${serverPath}_matrix/client/r0/rooms/${room}/messages`;
}

async function doCall (cfg, from) {
  try {
    const result = await axios.get(
      endpointPath(cfg.host, cfg.room),
      {
        headers: {
          'Authorization': `Bearer ${cfg.token}`
        },
        params: {
          dir: 'b',
          from,
        }
      }
    );
    return result.data;
  } catch (e) {
    console.log(e);
  }
  return 5;
}

async function doBackup (cfg, stream) {
  let from;
  let done = false;
  const result = [];

  while (!done) {
    const batch = await doCall(cfg, from);
    from = batch.end;
    done = !batch.chunk.length;
    result.unshift(...batch.chunk);
    process.stdout.write(`Fetched ${batch.chunk.length} messages\n`);
  }

  process.stdout.write(`Writing to ${cfg.output}`);

  result.map(
    item => stream.write(`${JSON.stringify(item)}\n`),
  );

  stream.end();
}

async function entry () {
  const cfg = await config();

  try {
    const fileStream = createWriteStream(
      join(process.cwd(), cfg.output),
      { encoding: 'utf-8' }
    );
    await doBackup(cfg, fileStream);
  } catch (e) {
    process.stderr.write('Something went wrong... \n');
    process.stderr.write(e);
    process.exit();
  }

  process.stdout.write('\nDone!\n\n');
}

entry();