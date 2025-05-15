// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  console.log('API called with query:', q); // Debug log
  if (!q || typeof q !== 'string') {
    console.log('Invalid query parameter:', q); // Debug log
    return NextResponse.json({ error: 'Invalid query parameter' }, { status: 400 });
  }

  // Simulate API delay for typing indicator
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const normalizedQuery = q.toLowerCase().trim(); // Normalize input
  console.log('Processing query:', normalizedQuery); // Debug log

  // Use includes() for flexible matching
  if (normalizedQuery === 'hello' || normalizedQuery.includes('hi')) {
    return NextResponse.json({ response: 'Hello! How can I help you today?' });
  } else if (normalizedQuery.includes('what is your name') || normalizedQuery.includes('who are you')) {
    return NextResponse.json({ response: "I'm a chatbot built by MAS." });
  } else if (normalizedQuery === 'error') {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  } else {
    return NextResponse.json({
      response: "Sorry, I didn't understand that. Try asking about our vintage clothing collection!",
    });
  }
}