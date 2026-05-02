import { NextResponse } from 'next/server';

export async function GET() {
  // Simulated GCal fetch for the first 7 days
  const mockEvents = [
    { id: 'g1', summary: 'Project Sync', start: new Date(Date.now() + 86400000).toISOString(), end: '...', source: 'GCal' },
    { id: 'g2', summary: 'Design Review', start: new Date(Date.now() + 172800000).toISOString(), end: '...', source: 'GCal' },
  ];
  
  return NextResponse.json({ events: mockEvents });
}
