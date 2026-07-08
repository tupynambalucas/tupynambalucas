import { spawnSync } from 'child_process';
import net from 'net';

const PORT = 3002;
const HOST = '127.0.0.1';

function checkPort(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = (): void => {
      socket.destroy();
      resolve(false);
    };

    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });
}

async function main(): Promise<void> {
  const isDevRunning = await checkPort(PORT, HOST);

  if (isDevRunning === true) {
    console.warn('\x1b[33m[Docusaurus Build] Dev server is active on port 3002.\x1b[0m');
    console.warn(
      '\x1b[33m[Docusaurus Build] Skipping production build to prevent dev server crash.\x1b[0m',
    );
    console.warn(
      '\x1b[33m[Docusaurus Build] If you want to force a production build, stop the dev server first.\x1b[0m\n',
    );
    process.exit(0);
  }

  console.info(
    '[Docusaurus Build] Dev server not active on port 3002. Proceeding with docusaurus build...',
  );
  const result = spawnSync('docusaurus', ['build'], { stdio: 'inherit', shell: true });
  process.exit(result.status ?? 0);
}

void main();
