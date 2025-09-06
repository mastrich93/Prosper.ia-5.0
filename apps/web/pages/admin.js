import { useEffect, useState } from 'react';

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/leads`);
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        setError('Errore nel recupero dei lead');
      }
    }
    fetchLeads();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Dashboard Lead</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>ID</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Nome</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Settore</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Verificato</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Score</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Prezzo (€)</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '4px' }}>{lead.id.slice(0, 8)}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '4px' }}>{lead.name}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '4px' }}>{lead.sector}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '4px' }}>{lead.verified ? 'Sì' : 'No'}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '4px' }}>{lead.score ?? '-'}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '4px' }}>{lead.price ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}