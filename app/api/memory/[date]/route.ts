import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MEMORY_DAILY_PATH = path.join(process.cwd(), 'memory/daily');
const MEMORY_LONGTERM_PATH = path.join(process.cwd(), 'memory/longterm.md');

const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request, { params }: { params: { date: string } }) {
  try {
    const { date } = params;
    let content = '';

    if (date === 'longterm') {
      content = await fs.readFile(MEMORY_LONGTERM_PATH, 'utf8');
    } else if (VALID_DATE.test(date)) {
      content = await fs.readFile(path.join(MEMORY_DAILY_PATH, `${date}.md`), 'utf8');
    } else {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Memory file not found' }, { status: 404 });
  }
}
