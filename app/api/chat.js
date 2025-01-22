// pages/api/chat.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { question } = req.body;  // Récupérer la question du corps de la requête
  
      // Appel API vers Hugging Face
      const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,  // Remplace par ta clé API Hugging Face
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: question,  // La question de l'utilisateur
        }),
      });
  
      // Récupérer la réponse du modèle Hugging Face
      const data = await response.json();
  
      // Renvoyer la réponse au frontend
      res.status(200).json(data);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
  