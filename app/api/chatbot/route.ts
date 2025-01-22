// Exemple de route API pour le chatbot dans Next.js (Vercel)
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Si la variable 'request' n'est pas utilisée, tu peux la retirer.
  // Si tu veux utiliser les données envoyées dans la requête, tu peux faire un traitement ici.

  const { message } = await request.json(); // Récupère le message de l'utilisateur depuis la requête

  // Traitement de la logique du chatbot (par exemple, générer une réponse)
  const botResponse = `Bot réponse à: ${message}`;

  // Retourne la réponse sous forme JSON
  return NextResponse.json({ botResponse });
}
