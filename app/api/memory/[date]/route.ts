import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MEMORY_DAILY_PATH = path.join(process.cwd(), 'memory/daily');
const MEMORY_LONGTERM_PATH = path.join(process.cwd(), 'memory/longterm.md');

export async function GET(request: Request, { params }: { params: { date: string } }) {
  try {
    const { date } = params;
    let content = '';
    
    if (date === 'longterm') {
      content = await fs.readFile(MEMORY_LONGTERM_PATH, 'utf8');
    } else {
      const safeDate = date.replace(/[^a-zA-Z0-9\-_]/g, '');
      content = await fs.readFile(path.join(MEMORY_DAILY_PATH, `${safeDate}.md`), 'utf8');
    }
    
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Memory file not found' }, { status: 404 });
  }
}
