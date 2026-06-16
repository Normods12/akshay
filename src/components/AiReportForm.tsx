import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
// @ts-ignore
import { getPlanetaryPositions } from 'vedic-astro';
import { generateAstrologyReport } from '../utils/ai';
import ReactMarkdown from 'react-markdown';

interface AiReportFormProps {
  featureTitle: string;
}

export function AiReportForm({ featureTitle }: AiReportFormProps) {
  const [formData, setFormData] = useState({ name: '', date: '', time: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Basic fallback location if not using Google Maps Geocoding yet
      const loc = { latitude: 28.6139, longitude: 77.2090 };
      
      let astrologyData = null;
      if (formData.date && formData.time) {
        try {
          const iso = `${formData.date}T${formData.time}:00Z`;
          astrologyData = await getPlanetaryPositions({ iso }, loc);
        } catch (err) {
          console.warn("Failed to generate precise planetary math, passing raw details to AI instead.");
        }
      }

      const generatedText = await generateAstrologyReport(featureTitle, formData, astrologyData);
      setReport(generatedText);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating your report.");
    } finally {
      setLoading(false);
    }
  };

  if (report) {
    return (
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <div style={{ 
          padding: '1.5rem', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-gold)',
          color: 'var(--text-primary)',
          lineHeight: '1.6',
          fontSize: '0.95rem'
        }}>
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h2 style={{color: 'var(--accent-gold)', marginBottom: '1rem'}} {...props}/>,
              h2: ({node, ...props}) => <h3 style={{color: 'var(--accent-gold)', marginTop: '1.5rem', marginBottom: '0.5rem'}} {...props}/>,
              h3: ({node, ...props}) => <h4 style={{color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.5rem'}} {...props}/>,
              strong: ({node, ...props}) => <strong style={{color: 'var(--accent-gold)'}} {...props}/>,
              ul: ({node, ...props}) => <ul style={{marginLeft: '1.5rem', marginBottom: '1rem'}} {...props}/>,
              li: ({node, ...props}) => <li style={{marginBottom: '0.5rem'}} {...props}/>,
              p: ({node, ...props}) => <p style={{marginBottom: '1rem'}} {...props}/>,
            }}
          >
            {report}
          </ReactMarkdown>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setReport(null)}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Generate Another Report
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ marginTop: '2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-gold)' }} />
        <h3 className="heading-sm text-gradient" style={{ textAlign: 'center' }}>Consulting the Stars...</h3>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
          Please wait while our AI Astrologer analyzes your planetary alignments and generates your personalized {featureTitle}. This may take a few moments.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: '1rem' }}>
      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Full Name" 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="date" 
          className="form-input" 
          required 
          value={formData.date} 
          onChange={e => setFormData({...formData, date: e.target.value})} 
        />
        <input 
          type="time" 
          className="form-input" 
          required 
          value={formData.time} 
          onChange={e => setFormData({...formData, time: e.target.value})} 
        />
        <input 
          type="text" 
          className="form-input" 
          placeholder="Birth City (e.g. New Delhi)" 
          required 
          value={formData.location} 
          onChange={e => setFormData({...formData, location: e.target.value})} 
        />
        
        {error && <p style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{error}</p>}
        
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} /> Generate {featureTitle}
        </button>
      </form>
    </div>
  );
}
