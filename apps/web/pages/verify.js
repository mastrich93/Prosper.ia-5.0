import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Verify() {
  const router = useRouter();
  const { id } = router.query;
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');
  const [verified, setVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    setStatus('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/leads/${id}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (data.verified) {
        setVerified(true);
      } else {
        setStatus('Codice errato. Riprova.');
      }
    } catch (err) {
      setStatus('Errore di rete');
    }
  };

  if (!id) {
    return <p>Lead non valido.</p>;
  }
  if (verified) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Verifica completata!</h1>
        <p>Il tuo contatto è stato verificato. Ti invieremo i preventivi via e‑mail o WhatsApp non appena disponibili.</p>
      </main>
    );
  }
  return (
    <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Verifica email</h1>
      <p>Inserisci il codice OTP che hai ricevuto via email.</p>
      {status && <p style={{ color: 'red' }}>{status}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" required />
        <button type="submit">Verifica</button>
      </form>
    </main>
  );
}