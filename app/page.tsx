'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [results, setResults] = useState<{ name: string; time: string }[]>([]);

  const handleStart = () => {
    if (!name.trim()) return alert('Zadajte meno');
    setStartTime(new Date());
    setEndTime(null);
  };

  const handleStop = () => {
    if (!name.trim()) return alert('Zadajte meno');
    if (!startTime) return alert('Najprv spustite časovač');

    const now = new Date();
    setEndTime(now);
    const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const timeString = `${duration} sekúnd`;

    // Pridáme výsledok do zoznamu
    setResults([...results, { name, time: timeString }]);

    // ODOSLANIE DO GOOGLE SHEETS
    fetch('https://script.google.com/macros/s/AKfycbs9SzgXrHz7uWNZo15ziuuJh73tclvTMOlPO-PYE9kdpVkfYntfJwSjaGlBBfrZKv53/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        time: timeString,
      }),
    })
      .then(() => {
        console.log('Odoslané do Google Sheets.');
      })
      .catch((err) => {
        console.error('Chyba pri ukladaní do Sheets:', err);
      });

    // Resetovanie stavu
    setName('');
    setStartTime(null);
  };

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        KUKULANDIA - Bludisko časovač
      </h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Zadajte meno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            width: '100%',
            marginBottom: '0.5rem',
          }}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleStart}
            disabled={!!startTime}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: startTime ? 'not-allowed' : 'pointer',
            }}
          >
            Štart
          </button>
          <button
            onClick={handleStop}
            disabled={!startTime}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !startTime ? 'not-allowed' : 'pointer',
            }}
          >
            Stop
          </button>
        </div>
        {startTime && <p style={{ marginTop: '0.5rem' }}>Čas beží od: {startTime.toLocaleTimeString()}</p>}
        {endTime && <p style={{ marginTop: '0.5rem' }}>Výsledný čas: {results.at(-1)?.time}</p>}
      </div>

      <h2 style={{ fontSize: '1.25rem', marginTop: '2rem' }}>Výsledky:</h2>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <strong>{r.name}</strong>: {r.time}
          </li>
        ))}
      </ul>
    </main>
  );
}
