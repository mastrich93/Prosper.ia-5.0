import { useEffect, useState } from 'react';

export default function Supervisor() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/leads`);
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        setError('Errore nel caricamento dei lead');
      }
    }
    load();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Dashboard Supervisore</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Settore</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.sector}</td>
              <td>{lead.email}</td>
              <td>{lead.phone || '-'}</td>
              <td>{lead.verified ? 'Verificato' : 'Da verificare'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}