export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Bienvenue sur mon chatbot !</h1>
      <form>
        <textarea
          placeholder="Posez votre question ici..."
          rows="5"
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
