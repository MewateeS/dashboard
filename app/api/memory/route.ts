import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MEMORY_DAILY_PATH = path.join(process.cwd(), 'memory/daily');
const MEMORY_LONGTERM_PATH = path.join(process.cwd(), 'memory/longterm.md');

async function getDailyFiles() {
  try {
    const files = await fs.readdir(MEMORY_DAILY_PATH);
    const mdFiles = files.filter(f => f.endsWith('.md')).sort((a, b) => b.localeCompare(a));
    
    const metadata = await Promise.all(mdFiles.map(async (file) => {
      const content = await fs.readFile(path.join(MEMORY_DAILY_PATH, file), 'utf8');
      const lines = content.split('\n');
      return {
        date: file.replace('.md', ''),
        wordCount: content.split(/\s+/).length,
        preview: lines[0]?.substring(0, 60) || '',
        filename: file
      };
    }));
    
    return metadata;
  } catch (e) {
    return [];
  }
}

export async function GET() {
  try {
    const daily = await getDailyFiles();
    return NextResponse.json({ daily });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch memory metadata' }, { status: 500 });
  }
}
