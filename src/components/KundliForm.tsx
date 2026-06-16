import { useState } from 'react';
import { Compass, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
// @ts-ignore - ignoring types if not available
import { getPlanetaryPositions, getPanchang } from 'vedic-astro';

export function KundliForm() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock latitude/longitude for the text input (In a real app, use Google Maps API to convert City -> Lat/Lng)
      // For now, using default coordinates (Delhi) as placeholder
      const locationCoords = { latitude: 28.6139, longitude: 77.2090 };
      
      const dateTimeString = `${formData.date}T${formData.time}:00.000Z`;
      
      // Call the free local library
      const eph = await getPlanetaryPositions({ iso: dateTimeString }, locationCoords);
      const panchang = getPanchang(eph, locationCoords);
      
      setResult({
        panchang,
        planets: eph
      });
      
    } catch (error) {
      console.error(error);
      alert("Error generating Kundli locally.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 className="heading-sm text-gradient">Generate Free Kundli</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Enter your birth details to instantly generate your Vedic Horoscope.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Enter your full name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
        </div>

        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> Date of Birth
            </label>
            <input 
              type="date" 
              className="form-input" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> Time of Birth
            </label>
            <input 
              type="time" 
              className="form-input" 
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> Place of Birth
          </label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="City, State, Country" 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Compass size={18} />} 
          {loading ? 'Calculating...' : 'Generate Kundli Online'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)' }}>
          <h4 className="heading-sm text-gradient" style={{ marginBottom: '1rem' }}>Generated Data for {formData.name}</h4>
          
          <div className="grid grid-cols-2" style={{ gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Nakshatra:</strong> {result.panchang.nakshatra || 'Unknown'}
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Tithi:</strong> {result.panchang.tithi || 'Unknown'}
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Yoga:</strong> {result.panchang.yoga || 'Unknown'}
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Karana:</strong> {result.panchang.karana || 'Unknown'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
