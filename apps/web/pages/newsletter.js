import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // In a full implementation this would call the API to subscribe the user.
      // For this prototype, we simply simulate a double opt-in request.
      setSubmitted(true);
    } catch (err) {
      setError('Errore di rete');
    }
  };

  if (submitted) {
    return (
      <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
        <h1>Iscrizione alla newsletter</h1>
        <p>Grazie per la tua iscrizione! Ti abbiamo inviato un'email per confermare l'iscrizione (double opt‑in).</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Iscriviti alla newsletter</h1>
      <p>Resta aggiornato sulle offerte e sulle novità di Prosperia. Riceverai un'email di conferma.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="La tua email" required />
        <button type="submit">Iscriviti</button>
      </form>
    </main>
  );
}