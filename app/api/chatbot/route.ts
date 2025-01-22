// app/api/chatbot/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();

  // Configuration CORS pour autoriser les requêtes depuis ton portfolio GitHub Pages
  const response = NextResponse.json({ botResponse: 'This is a response from the bot!' });

  response.headers.set('Access-Control-Allow-Origin', 'https://badreddineek.github.io/Portfolio/index.html#'); // Remplace par l'URL de ton portfolio
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}
