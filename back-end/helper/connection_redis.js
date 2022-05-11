import { createClient } from 'redis';

export const client = createClient({
  port: 6379,
  host: '127.0.0.1',
});

await client.connect();
  