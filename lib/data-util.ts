import { Redis } from '@upstash/redis';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export const dataStore = {
  async get(key: string) {
    if (redis) {
      return await redis.get(key);
    }
    const filePath = path.join(DATA_DIR, `${key}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown) {
    if (redis) {
      await redis.set(key, value);
    } else {
      const filePath = path.join(DATA_DIR, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
    }
  },

  async readJson(fileName: string) {
    return this.get(fileName.replace('.json', ''));
  },

  async writeJson(fileName: string, data: unknown) {
    await this.set(fileName.replace('.json', ''), data);
  },
};
