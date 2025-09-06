import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    cap: '',
    sector: '',
    description: '',
    budget: '',
    urgency: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/leads/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          city: form.city || undefined,
          cap: form.cap || undefined,
          sector: form.sector,
          description: form.description,
          budget: form.budget ? parseFloat(form.budget) : undefined,
          urgency: form.urgency ? parseFloat(form.urgency) : undefined,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setLeadId(data.id);
        setSubmitted(true);
      } else {
        setError(data.error || 'Errore nella creazione del lead');
      }
    } catch (err) {
      setError('Errore di rete');
    }
  };

  if (submitted) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Grazie per la tua richiesta!</h1>
        <p>Abbiamo ricevuto i tuoi dati. Ti abbiamo inviato un codice OTP via email. Inseriscilo nella pagina seguente per confermare il contatto.</p>
        <p>
          <a href={`/verify?id=${leadId}`}>Vai alla pagina di verifica &rarr;</a>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Richiedi preventivo</h1>
      <p>Compila il form per essere messo in contatto con aziende qualificate. Ti invieremo un codice OTP via email per verificare la tua richiesta.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Telefono (opzionale)" value={form.phone} onChange={handleChange} />
        <input name="city" placeholder="Città" value={form.city} onChange={handleChange} />
        <input name="cap" placeholder="CAP" value={form.cap} onChange={handleChange} />
        <input name="sector" placeholder="Settore (es. assicurazioni, ristrutturazioni)" value={form.sector} onChange={handleChange} required />
        <textarea name="description" placeholder="Descrivi cosa stai cercando..." value={form.description} onChange={handleChange} required />
        <input name="budget" type="number" step="0.01" placeholder="Budget indicativo (€)" value={form.budget} onChange={handleChange} />
        <input name="urgency" type="number" min="0" max="1" step="0.1" placeholder="Urgenza (0-1)" value={form.urgency} onChange={handleChange} />
        <button type="submit">Invia richiesta</button>
      </form>
    </main>
  );
}