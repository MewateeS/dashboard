import { kv } from '@vercel/kv';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Data utility wrapper to switch between local FS and Vercel KV.
 * Environment variable VERCEL_ENV determines the mode.
 * 'production' -> Vercel KV
 * 'development' or others -> Local File System
 */
export const dataStore = {
  async get(key: string) {
    const isProd = process.env.VERCEL_ENV === 'production';
    
    if (isProd) {
      const data = await kv.get(key);
      return data;
    } else {
      const filePath = path.join(DATA_DIR, `${key}.json`);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error(`Local read error for ${key}:`, error);
        return null;
      }
    }
  },

  async set(key: string, value: any) {
    const isProd = process.env.VERCEL_ENV === 'production';

    if (isProd) {
      await kv.set(key, value);
    } else {
      const filePath = path.join(DATA_DIR, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
    }
  },

  /**
   * Helper for the specific files requested:
   * agents.json, tasks.json, schedule.json, projects.json, mission.json
   */
  async readJson(fileName: string) {
    // remove .json extension if present
    const key = fileName.replace('.json', '');
    return this.get(key);
  },

  async writeJson(fileName: string, data: any) {
    const key = fileName.replace('.json', '');
    await this.set(key, data);
  }
};
