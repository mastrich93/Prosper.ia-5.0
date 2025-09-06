import { Worker } from 'bullmq';

// Worker process for asynchronous tasks (matching, notifications, etc.)
// Use the REDIS_URL environment variable if present.  When running on
// Railway, the Redis add-on sets this to a URL of the form
// `redis://:password@host:port`.  If REDIS_URL is undefined, fall back
// to a local Redis instance for local development.
let redisConnection;
const redisUrl = process.env.REDIS_URL;
if (redisUrl) {
  try {
    const url = new URL(redisUrl);
    const { hostname: host, port, password, username } = url;
    // BullMQ accepts connection options containing host, port and
    // authentication credentials.  Coerce port to a number and include
    // username/password only if defined.
    redisConnection = {
      connection: {
        host,
        port: port ? Number(port) : 6379,
        username: username || undefined,
        password: password || undefined,
      },
    };
  } catch (err) {
    console.error('Invalid REDIS_URL; falling back to default connection', err);
    redisConnection = { connection: { host: 'localhost', port: 6379 } };
  }
} else {
  redisConnection = { connection: { host: 'localhost', port: 6379 } };
}

// Example worker for a matching queue
const matchWorker = new Worker(
  'match',
  async (job) => {
    console.log('Processing match job', job.id, job.data);
    // Implement matching logic here
  },
  redisConnection
);

matchWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

console.log('Worker started');