import { createClient } from 'redis';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

let _client: ReturnType<typeof createClient> | null = null;

async function getRedis() {
  if (!process.env.REDIS_URL) return null;
  if (!_client || !_client.isOpen) {
    _client = createClient({ url: process.env.REDIS_URL });
    _client.on('error', () => { _client = null; });
    await _client.connect();
  }
  return _client;
}

export const dataStore = {
  async get(key: string) {
    const redis = await getRedis();
    if (redis) {
      const val = await redis.get(key);
      return val ? JSON.parse(val) : null;
    }
    const filePath = path.join(DATA_DIR, `${key}.json`);
    try {
      return JSON.parse(await fs.readFile(filePath, 'utf-8'));
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown) {
    const redis = await getRedis();
    if (redis) {
      await redis.set(key, JSON.stringify(value));
    } else {
      await fs.writeFile(
        path.join(DATA_DIR, `${key}.json`),
        JSON.stringify(value, null, 2),
        'utf-8'
      );
    }
  },

  async readJson(fileName: string) {
    return this.get(fileName.replace('.json', ''));
  },

  async writeJson(fileName: string, data: unknown) {
    await this.set(fileName.replace('.json', ''), data);
  },
};
