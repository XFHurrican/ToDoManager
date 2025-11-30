import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Test API called');
    return NextResponse.json({ message: 'Test API works!' });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ error: 'Test API failed' }, { status: 500 });
  }
}