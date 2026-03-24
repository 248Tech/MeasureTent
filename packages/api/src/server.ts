import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildApp } from './app.js';

const DEFAULT_PORT = 3001;
const DEFAULT_HOST = '0.0.0.0';

function parsePort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${value}`);
  }

  return port;
}

function isMainModule(): boolean {
  const entryFile = process.argv[1];

  if (!entryFile) {
    return false;
  }

  return pathToFileURL(resolve(entryFile)).href === import.meta.url;
}

export async function startServer(): Promise<void> {
  const app = await buildApp();
  const port = parsePort(process.env.PORT);
  const host = process.env.HOST ?? DEFAULT_HOST;

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    app.log.info({ signal }, 'Shutting down');
    await app.close();
    process.exit(0);
  };

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  await app.listen({ port, host });
}

if (isMainModule()) {
  void startServer().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
