import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Autoriser les requêtes CORS de ton portfolio
  const response = NextResponse.json({
    botResponse: "Message reçu. Comment puis-je vous aider ?",
  });

  // Définir les en-têtes CORS
  response.headers.set('Access-Control-Allow-Origin', 'https://badreddineek.github.io/Portfolio/index.html#');  // Remplace par ton URL de portfolio
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
