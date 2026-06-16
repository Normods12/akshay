import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KundliForm } from './KundliForm';
import { GunMilanForm } from './GunMilanForm';
import { ManglikForm, DashaForm } from './AnalysisForms';
import { AiReportForm } from './AiReportForm';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    id: string;
    title: string;
    description: string;
    icon: any;
    details?: string;
  } | null;
}

export function FeatureModal({ isOpen, onClose, feature }: FeatureModalProps) {
  if (!feature) return null;
  const Icon = feature.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '90%',
              maxWidth: '500px',
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              zIndex: 1001,
              boxShadow: 'var(--shadow-gold)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <X size={24} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(212, 175, 55, 0.1)', 
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-gold)'
              }}>
                <Icon size={32} />
              </div>
              <h2 className="heading-sm text-gradient">{feature.title}</h2>
            </div>
            
            {feature.id === 'kundli-generation' ? (
              <div style={{ marginTop: '1rem' }}>
                <KundliForm />
              </div>
            ) : feature.id === 'gun-milan' ? (
              <div style={{ marginTop: '1rem' }}>
                <GunMilanForm />
              </div>
            ) : feature.id === 'manglik-analysis' ? (
              <div style={{ marginTop: '1rem' }}>
                <ManglikForm />
              </div>
            ) : feature.id === 'dasha-transit' ? (
              <div style={{ marginTop: '1rem' }}>
                <DashaForm />
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  {feature.description}
                </p>
                <AiReportForm featureTitle={feature.title} />
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
