import {$, argv} from 'bun'
import {kill} from "node:process"

const args = argv.slice(2);
console.log(process.pid);

const port = parseInt(args[0]) || 3000;

console.log('Killing processes attached to port:', port);

const processIDs = await $`lsof -i:${port} -t`.text('utf-8')

const processes = processIDs.split('\n').filter(Boolean)

for (const processID of processes) {
    if (!processID) {
      continue
    }
  const id = parseInt(processID);
  console.log('Killing process:', id);
    kill(id, 9);
}

const check = await $`lsof -i:${port} -t`.text('utf-8')
console.log(check.trim() === '' ? 'All processes killed' : 'Failed to kill all processes');
process.exit(0)


