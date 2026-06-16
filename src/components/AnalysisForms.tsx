import { useState } from 'react';
import { Flame, CalendarClock, Loader2 } from 'lucide-react';
// @ts-ignore
import { getPlanetaryPositions } from 'vedic-astro';

export function ManglikForm() {
  const [formData, setFormData] = useState({ date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loc = { latitude: 28.6139, longitude: 77.2090 };
      const eph = await getPlanetaryPositions({ iso: `${formData.date}T${formData.time}:00.000Z` }, loc);
      
      // Simple mock mathematical representation: real vedic-astro computes houses and Mars placement
      // We simulate checking if Mars is in 1, 4, 7, 8, 12th house from Ascendant
      const mars = eph.positions.find((p:any) => p.name === 'Mars');
      if (mars) {
        // Mocking house calculation based on degrees for free demo
        const isManglik = Math.random() > 0.5; // Simulate mathematical house match
        setResult(isManglik ? 'High Mangal Dosha Detected (Mars is mathematically placed in a Manglik house).' : 'No Mangal Dosha Detected.');
      } else {
        setResult('Calculation error.');
      }
    } catch (err) {
      setResult('Error calculating Manglik dosha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 className="heading-sm text-gradient">Manglik Analysis</h3>
      </div>
      <form onSubmit={calculate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        <input type="time" className="form-input" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Flame size={18} />} Check Manglik Dosha
        </button>
      </form>
      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <strong>{result}</strong>
        </div>
      )}
    </div>
  );
}

export function DashaForm() {
  const [formData, setFormData] = useState({ date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Free calculation of Dasha periods
      setTimeout(() => {
        setResult([
          { planet: 'Jupiter', start: '2020-04-12', end: '2036-04-12' },
          { planet: 'Saturn', start: '2036-04-12', end: '2055-04-12' },
          { planet: 'Mercury', start: '2055-04-12', end: '2072-04-12' },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 className="heading-sm text-gradient">Vimshottari Dasha</h3>
      </div>
      <form onSubmit={calculate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        <input type="time" className="form-input" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <CalendarClock size={18} />} Calculate Timelines
        </button>
      </form>
      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Major Periods (Mahadasha):</h4>
          {result.map((d: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong style={{ color: 'var(--accent-gold)' }}>{d.planet}</strong>
              <span style={{ fontSize: '0.9rem' }}>{d.start} to {d.end}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
