// route.ts
import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // On importe fetch pour pouvoir l'utiliser côté serveur

// Remplace ceci par ta clé API Hugging Face
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY; // Utilisation d'une clé API dans l'environnement




export async function POST(request: Request) {
  const { message } = await request.json(); // Récupère le message envoyé par l'utilisateur

  try {
    // Appel à l'API Hugging Face
// Vérifie si la réponse est valide
const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: message,
    }),
  });
  
  if (!response.ok) {
    console.error('Erreur avec l\'API Hugging Face:', response.status, response.statusText);
    const errorBody = await response.text();
    console.error('Détails de l\'erreur:', errorBody);
    throw new Error('Erreur de connexion à l\'API Hugging Face');
  }
  
  const data = await response.json(); // Récupère la réponse du modèle Hugging Face

    // On vérifie si la réponse contient 'choices' ou 'generated_text'
    const botResponse = data?.choices?.[0]?.text || data?.generated_text || 'Désolé, je n\'ai pas compris votre question.';

    // Retourne la réponse générée par le modèle
    return NextResponse.json({ botResponse });
  } catch (error) {
    // Gestion d'erreur en cas de problème avec l'API Hugging Face
    console.error(error);
    return NextResponse.json({ botResponse: 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.' });
  }
}
