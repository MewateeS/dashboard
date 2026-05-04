import { createClient } from 'redis';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const isProduction = process.env.VERCEL_ENV === 'production';

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

async function getVercelKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  try {
    return { url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN };
  } catch {
    return null;
  }
}

async function kvGet(key: string) {
  const kv = await getVercelKv();
  if (!kv) return null;
  try {
    const res = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: unknown) {
  const kv = await getVercelKv();
  if (!kv) return false;
  try {
    const res = await fetch(`${kv.url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kv.token}` },
      body: JSON.stringify({ value: JSON.stringify(value) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const dataStore = {
  async get(key: string) {
    // Production: use Vercel KV or Redis only
    if (isProduction) {
      const kvVal = await kvGet(key);
      if (kvVal !== null) return kvVal;
      const redis = await getRedis();
      if (redis) {
        const val = await redis.get(key);
        return val ? JSON.parse(val) : null;
      }
      return null;
    }

    // Development: try Redis, then file-based
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
    // Production: use Vercel KV or Redis only
    if (isProduction) {
      const kvOk = await kvSet(key, value);
      if (kvOk) return;
      const redis = await getRedis();
      if (redis) {
        await redis.set(key, JSON.stringify(value));
        return;
      }
      console.warn(`Failed to persist ${key}: no KV or Redis available`);
      return;
    }

    // Development: try Redis, then file-based
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
