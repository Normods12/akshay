import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, Upload, CheckCircle2, AlertCircle, Clock, Send, 
  RefreshCw, Eye, ShieldCheck, CheckSquare, Square, Search, Filter, 
  Smartphone, IndianRupee, History, Sparkles, Terminal, X, ExternalLink
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function ChitFundDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ config: {}, subscribers: [], stats: {} });
  const [filterStatus, setFilterStatus] = useState('pending'); // 'all' | 'pending' | 'paid'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [previewSub, setPreviewSub] = useState(null);
  const [previewMessage, setPreviewMessage] = useState(null);
  const [dispatchMode, setDispatchMode] = useState('mock'); // 'mock' | 'meta' | 'baileys'
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState({ current: 0, total: 0, logs: [], results: [] });
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch Chit Fund Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/chitfund/data`);
      const json = await res.json();
      if (json.success) {
        setData({
          config: json.config || {},
          subscribers: json.subscribers || [],
          stats: json.stats || {}
        });
        // Auto-select all pending subscribers for convenience
        const pendingIds = new Set(
          (json.subscribers || [])
            .filter(s => !s.hasPaid)
            .map(s => s.id)
        );
        setSelectedIds(pendingIds);
      }
    } catch (err) {
      console.error('Failed to load chit fund data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch History
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chitfund/history`);
      const json = await res.json();
      if (json.success) {
        setHistory(json.history || []);
      }
    } catch (e) {
      console.error('Failed to fetch history:', e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchHistory();
  }, []);

  // Handle Excel Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await fetch(`${API_BASE}/api/chitfund/upload`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        setData({
          config: json.config || {},
          subscribers: json.subscribers || [],
          stats: json.stats || {}
        });
        const pendingIds = new Set(
          (json.subscribers || [])
            .filter(s => !s.hasPaid)
            .map(s => s.id)
        );
        setSelectedIds(pendingIds);
        alert(`Success: ${json.message}`);
      } else {
        alert(`Upload error: ${json.error}`);
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Reset to Sample
  const handleResetSample = async () => {
    if (!window.confirm('Reset back to original DMR Chit Fund sample data?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/chitfund/reset`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setData({
          config: json.config || {},
          subscribers: json.subscribers || [],
          stats: json.stats || {}
        });
        const pendingIds = new Set(
          (json.subscribers || [])
            .filter(s => !s.hasPaid)
            .map(s => s.id)
        );
        setSelectedIds(pendingIds);
      }
    } catch (e) {
      alert('Reset failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Subscribers
  const filteredSubscribers = useMemo(() => {
    return (data.subscribers || []).filter(sub => {
      // Payment status filter
      if (filterStatus === 'pending' && sub.hasPaid) return false;
      if (filterStatus === 'paid' && !sub.hasPaid) return false;

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = (sub.name || '').toLowerCase().includes(q);
        const matchPhone = (sub.phone || '').includes(q);
        const matchTNo = (sub.tNo || '').toLowerCase().includes(q);
        return matchName || matchPhone || matchTNo;
      }
      return true;
    });
  }, [data.subscribers, filterStatus, searchTerm]);

  // Selection Toggles
  const handleToggleSelect = (id) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const handleSelectAllPending = () => {
    const pendingIds = new Set(
      data.subscribers
        .filter(s => !s.hasPaid)
        .map(s => s.id)
    );
    setSelectedIds(pendingIds);
  };

  const handleSelectAllVisible = () => {
    const visibleIds = new Set(filteredSubscribers.map(s => s.id));
    setSelectedIds(visibleIds);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Preview Message
  const handleOpenPreview = async (sub) => {
    setPreviewSub(sub);
    try {
      const res = await fetch(`${API_BASE}/api/chitfund/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriber: sub, config: data.config })
      });
      const json = await res.json();
      if (json.success) {
        setPreviewMessage(json.rendered.text);
      }
    } catch (e) {
      setPreviewMessage(`Failed to generate preview: ${e.message}`);
    }
  };

  // Execute Dispatch via Mock API
  const handleStartDispatch = async () => {
    const idsToDispatch = Array.from(selectedIds);
    if (idsToDispatch.length === 0) {
      alert('Please select at least one subscriber to fire reminders to.');
      return;
    }

    setIsDispatching(true);
    setShowDispatchModal(true);
    setDispatchProgress({
      current: 0,
      total: idsToDispatch.length,
      logs: [
        `[${new Date().toLocaleTimeString()}] 🚀 Initiating ${dispatchMode.toUpperCase()} outbound dispatch...`,
        `[${new Date().toLocaleTimeString()}] Target: ${idsToDispatch.length} selected subscribers`,
        `[${new Date().toLocaleTimeString()}] Privacy Check: Local-First sandbox active. No third-party data leakage.`
      ],
      results: []
    });

    try {
      // Simulate real-time progress steps for UI visualization
      const targets = data.subscribers.filter(s => idsToDispatch.includes(s.id));
      const simulatedLogs = [];
      const simResults = [];

      for (let i = 0; i < targets.length; i++) {
        const sub = targets[i];
        simulatedLogs.push(`[${new Date().toLocaleTimeString()}] 📤 Dispatching to +${sub.phone} (${sub.name} - ${sub.tNo})...`);
        setDispatchProgress(prev => ({
          ...prev,
          current: i + 1,
          logs: [...simulatedLogs]
        }));
        
        // Artificial delay for smooth animated UI feedback
        await new Promise(r => setTimeout(r, 400));

        const randomHex = Math.random().toString(36).substring(2, 9).toUpperCase();
        const mockMsgId = `wamid.HBgM${sub.phone}V1${randomHex}==`;

        simulatedLogs.push(`[${new Date().toLocaleTimeString()}] ✓ 200 OK — Delivered! (MsgID: ${mockMsgId})`);
        simResults.push({
          subscriber: sub.name,
          tNo: sub.tNo,
          phone: sub.phone,
          amount: sub.amount,
          messageId: mockMsgId,
          status: 'Delivered',
          timestamp: new Date().toLocaleTimeString()
        });

        setDispatchProgress(prev => ({
          ...prev,
          logs: [...simulatedLogs],
          results: [...simResults]
        }));
      }

      // Also call backend to persist in local history
      await fetch(`${API_BASE}/api/chitfund/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriberIds: idsToDispatch, mode: dispatchMode })
      });

      simulatedLogs.push(`[${new Date().toLocaleTimeString()}] 🏁 Batch dispatch completed! All ${idsToDispatch.length} reminders recorded.`);
      setDispatchProgress(prev => ({
        ...prev,
        logs: [...simulatedLogs]
      }));

      fetchHistory();
    } catch (err) {
      alert(`Dispatch error: ${err.message}`);
    } finally {
      setIsDispatching(false);
    }
  };

  const selectedCount = selectedIds.size;
  const pendingCount = data.stats.pendingCount || 0;
  const paidCount = data.stats.paidCount || 0;
  const totalDueAmount = data.stats.totalDueAmount || 0;
  const totalPaidAmount = data.stats.totalPaidAmount || 0;

  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto',
      padding: '32px 20px 80px',
      color: '#fff',
      fontFamily: 'var(--font-body, system-ui, sans-serif)'
    }}>
      {/* ─── Top Header Bar ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            <h1 style={{
              margin: 0,
              fontFamily: 'var(--font-heading, serif)',
              fontSize: '1.85rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fff 40%, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              DMR Chit Fund — WhatsApp Reminder Desk
            </h1>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '6px',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.65)'
          }}>
            <span style={{ color: '#d4af37', fontWeight: 600 }}>{data.config.fundName || 'DMR CHIT FUND PVT LTD'}</span>
            <span>•</span>
            <span>Batch: <strong style={{ color: '#fff' }}>{data.config.batch || 'DST1C - 25 LAKHS'}</strong></span>
            <span>•</span>
            <span>PSO: <strong style={{ color: '#fff' }}>{data.config.psoNumber || 'MM270826P567'}</strong></span>
            <span>•</span>
            <span>Month: <strong style={{ color: '#4ade80' }}>{data.stats.currentMonth || 'OCT-2026'}</strong></span>
          </div>
        </div>

        {/* Local-First & Mode Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ade80',
            fontSize: '0.78rem',
            fontWeight: 600
          }}>
            <ShieldCheck size={15} />
            <span>100% Local-First (No Cloud Leakage)</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#d4af37',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            <Sparkles size={14} />
            <span>Mock BSP API Active</span>
          </div>
        </div>
      </div>

      {/* ─── Metric Stat Cards ────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Total Subscribers */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #141414, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Members</span>
            <FileSpreadsheet size={18} style={{ color: '#d4af37' }} />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fff' }}>
            {data.stats.totalSubscribers || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
            Chit Group Volume: ₹{(data.stats.totalFundVolume || 0).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Paid This Month */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #0e1e14, #142a1b)',
          border: '1px solid rgba(74, 222, 128, 0.25)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Paid This Month</span>
            <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#4ade80' }}>
            {paidCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'rgba(74, 222, 128, 0.8)' }}>/ {data.stats.totalSubscribers || 0}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(74, 222, 128, 0.75)', marginTop: '4px' }}>
            Collected: ₹{totalPaidAmount.toLocaleString('en-IN')} ({data.stats.collectionPercentage || 0}%)
          </div>
        </div>

        {/* Pending Dues */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #261607, #331f0a)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Unpaid / Pending Dues</span>
            <AlertCircle size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fbbf24' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(251, 191, 36, 0.75)', marginTop: '4px' }}>
            Outstanding: ₹{totalDueAmount.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Selected to Fire */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #1f1a2e, #292040)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Selected for Reminder</span>
            <Smartphone size={18} style={{ color: '#c084fc' }} />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#c084fc' }}>
            {selectedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(192, 132, 252, 0.75)', marginTop: '4px' }}>
            Ready for instant dispatch
          </div>
        </div>
      </div>

      {/* ─── Excel File Management & Mode Bar ─────────────────────────── */}
      <div style={{
        padding: '18px 24px',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.18)',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d4af37'
          }}>
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
              Active Excel Sheet: <span style={{ color: '#d4af37' }}>DMR_ChitFund_Bot_Sample.xlsx</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Due Date: {data.stats.dueDate || '5th of month'} • Reminder: 3 days prior, on due date & 2 days after
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Upload size={15} />
            <span>{uploading ? 'Parsing Excel...' : 'Upload Monthly Excel'}</span>
          </button>

          <button
            onClick={handleResetSample}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Reset to default sample dataset"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ─── Controls: Filter Tabs, Search & Selectors ────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '18px'
      }}>
        {/* Status Filter Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setFilterStatus('pending')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: filterStatus === 'pending' ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
              color: filterStatus === 'pending' ? '#fbbf24' : 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <AlertCircle size={15} />
            <span>Pending Only ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: filterStatus === 'all' ? '#d4af37' : 'transparent',
              color: filterStatus === 'all' ? '#000' : 'rgba(255, 255, 255, 0.6)',
              transition: 'all 0.2s'
            }}
          >
            All Members ({data.stats.totalSubscribers || 0})
          </button>

          <button
            onClick={() => setFilterStatus('paid')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: filterStatus === 'paid' ? 'rgba(74, 222, 128, 0.2)' : 'transparent',
              color: filterStatus === 'paid' ? '#4ade80' : 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <CheckCircle2 size={15} />
            <span>Paid ({paidCount})</span>
          </button>
        </div>

        {/* Quick Selection Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleSelectAllPending}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#d4af37',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Select All Pending
          </button>

          <button
            onClick={handleSelectAllVisible}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Select Visible
          </button>

          <button
            onClick={handleClearSelection}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 80, 80, 0.1)',
              border: '1px solid rgba(255, 80, 80, 0.25)',
              color: '#ff6b6b',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '6px 12px',
            borderRadius: '10px'
          }}>
            <Search size={15} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
            <input
              type="text"
              placeholder="Search name, phone, T-No..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.85rem',
                width: '180px'
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── Subscribers Table ────────────────────────────────────────── */}
      <div style={{
        background: '#131313',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.18)',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        marginBottom: '24px'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#191919', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ padding: '14px 16px', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={filteredSubscribers.length > 0 && filteredSubscribers.every(s => selectedIds.has(s.id))}
                    onChange={() => {
                      if (filteredSubscribers.every(s => selectedIds.has(s.id))) {
                        handleClearSelection();
                      } else {
                        handleSelectAllVisible();
                      }
                    }}
                    style={{ cursor: 'pointer', accentColor: '#d4af37', width: '16px', height: '16px' }}
                  />
                </th>
                <th style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>T-NO</th>
                <th style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>SUBSCRIBER NAME</th>
                <th style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>PHONE NUMBER</th>
                <th style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>DUE DATE</th>
                <th style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600, textAlign: 'right' }}>AMOUNT DUE</th>
                <th style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600, textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600, textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Loading DMR Chit Fund subscribers...
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
                    No subscribers found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub, idx) => {
                  const isSelected = selectedIds.has(sub.id);
                  return (
                    <tr
                      key={sub.id || idx}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: isSelected ? 'rgba(212, 175, 55, 0.05)' : (idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'),
                        transition: 'background 0.15s'
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '14px 16px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(sub.id)}
                          style={{ cursor: 'pointer', accentColor: '#d4af37', width: '16px', height: '16px' }}
                        />
                      </td>

                      {/* T-Number */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(212, 175, 55, 0.12)',
                          color: '#d4af37',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}>
                          {sub.tNo}
                        </span>
                      </td>

                      {/* Name */}
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>
                        {sub.name}
                      </td>

                      {/* Phone */}
                      <td style={{ padding: '14px 16px', color: 'rgba(255, 255, 255, 0.75)', fontFamily: 'monospace' }}>
                        +{sub.phone}
                      </td>

                      {/* Due Date & Days */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#fff' }}>{sub.dueDate}</div>
                        {sub.daysRemaining !== '' && (
                          <div style={{ fontSize: '0.75rem', color: sub.hasPaid ? '#4ade80' : 'rgba(251, 191, 36, 0.85)' }}>
                            {sub.hasPaid ? 'Paid' : `${sub.daysRemaining} days remaining`}
                          </div>
                        )}
                      </td>

                      {/* Amount Due */}
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: sub.hasPaid ? '#4ade80' : '#fbbf24' }}>
                        ₹{Number(sub.amount).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {sub.hasPaid ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: 'rgba(74, 222, 128, 0.15)',
                            color: '#4ade80',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            <CheckCircle2 size={13} />
                            Paid {sub.paidDate ? `(${sub.paidDate})` : ''}
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: 'rgba(251, 191, 36, 0.15)',
                            color: '#fbbf24',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            <Clock size={13} />
                            Pending Due
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleOpenPreview(sub)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div style={{
          padding: '16px 20px',
          background: '#161616',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.65)'
        }}>
          <div>
            Showing <strong style={{ color: '#fff' }}>{filteredSubscribers.length}</strong> members • Selected: <strong style={{ color: '#d4af37' }}>{selectedCount}</strong>
          </div>

          {/* Firing CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Channel: <strong style={{ color: '#4ade80' }}>Mock BSP Gateway</strong>
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartDispatch}
              disabled={selectedCount === 0 || isDispatching}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                background: selectedCount > 0 ? 'linear-gradient(135deg, #d4af37, #b8860b)' : 'rgba(255, 255, 255, 0.1)',
                color: selectedCount > 0 ? '#000' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: selectedCount > 0 ? '0 4px 16px rgba(212, 175, 55, 0.35)' : 'none'
              }}
            >
              <Send size={16} />
              <span>Fire Reminders to Selected ({selectedCount})</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── Dispatch Telemetry & Execution Modal ─────────────────────── */}
      <AnimatePresence>
        {showDispatchModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '100%',
                maxWidth: '680px',
                background: '#121212',
                borderRadius: '20px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                background: '#181818',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Terminal size={20} style={{ color: '#d4af37' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                      Mock BSP API — Live Outbound Telemetry
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Simulating Meta WhatsApp Business Cloud API Gateway
                    </div>
                  </div>
                </div>

                {!isDispatching && (
                  <button
                    onClick={() => setShowDispatchModal(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {/* Progress Bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {isDispatching ? 'Dispatching Reminders...' : 'Dispatch Batch Complete'}
                    </span>
                    <strong style={{ color: '#4ade80' }}>
                      {dispatchProgress.current} / {dispatchProgress.total} ({dispatchProgress.total > 0 ? Math.round((dispatchProgress.current / dispatchProgress.total) * 100) : 0}%)
                    </strong>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${dispatchProgress.total > 0 ? (dispatchProgress.current / dispatchProgress.total) * 100 : 0}%`,
                      background: 'linear-gradient(90deg, #d4af37, #4ade80)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Simulated Log Terminal */}
                <div style={{
                  background: '#090909',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {dispatchProgress.logs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('✓') ? '#4ade80' : log.includes('🚀') ? '#d4af37' : 'rgba(255, 255, 255, 0.75)' }}>
                      {log}
                    </div>
                  ))}
                </div>

                {/* Delivery Receipts Summary */}
                {dispatchProgress.results.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                      Delivery Receipts ({dispatchProgress.results.length})
                    </div>
                    <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {dispatchProgress.results.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          fontSize: '0.78rem'
                        }}>
                          <div>
                            <strong style={{ color: '#fff' }}>{item.subscriber}</strong> ({item.tNo}) • +{item.phone}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#4ade80', fontWeight: 700 }}>✓ {item.status}</span>
                            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.72rem' }}>{item.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                {!isDispatching && (
                  <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <button
                      onClick={() => setShowDispatchModal(false)}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                        border: 'none',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      Close & Return to Desk
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── WhatsApp Message Live Preview Modal ──────────────────────── */}
      <AnimatePresence>
        {previewSub && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '100%',
                maxWidth: '460px',
                background: '#0c1317', // WhatsApp dark surface
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
                overflow: 'hidden'
              }}
            >
              {/* WhatsApp App Header */}
              <div style={{
                padding: '14px 18px',
                background: '#1f2c34',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#00a884',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    🏛️
                  </div>
                  <div>
                    <div style={{ color: '#e9edef', fontWeight: 600, fontSize: '0.92rem' }}>
                      {data.config.fundName || 'DMR Chit Fund Pvt Ltd'}
                    </div>
                    <div style={{ color: '#8696a0', fontSize: '0.72rem' }}>
                      Verified Official Business Desk
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewSub(null)}
                  style={{ background: 'transparent', border: 'none', color: '#8696a0', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Message Canvas */}
              <div style={{
                padding: '20px 16px',
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0)',
                backgroundSize: '16px 16px',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {/* Chat Bubble */}
                <div style={{
                  background: '#005c4b', // WhatsApp outbound green bubble
                  borderRadius: '12px 12px 2px 12px',
                  padding: '14px 16px',
                  color: '#e9edef',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                  whiteSpace: 'pre-wrap',
                  position: 'relative'
                }}>
                  {previewMessage || 'Generating personalized message...'}
                  <div style={{
                    textAlign: 'right',
                    fontSize: '0.68rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '6px'
                  }}>
                    11:30 AM <span style={{ color: '#53bdeb' }}>✓✓</span>
                  </div>
                </div>

                {/* Quick Action Interactive Buttons (Simulation) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginTop: '12px'
                }}>
                  <div style={{
                    background: '#202c33',
                    padding: '8px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#00a884',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    👉 Reply PAID
                  </div>
                  <div style={{
                    background: '#202c33',
                    padding: '8px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#00a884',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    👉 Reply PAY
                  </div>
                </div>
              </div>

              {/* Modal Bottom Footer */}
              <div style={{
                padding: '14px 18px',
                background: '#182229',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#8696a0' }}>
                  Target: {previewSub.name} ({previewSub.phone})
                </span>
                <button
                  onClick={() => setPreviewSub(null)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Recent Dispatch History Section ─────────────────────────── */}
      {history.length > 0 && (
        <div style={{
          marginTop: '40px',
          padding: '24px',
          background: '#131313',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <History size={18} style={{ color: '#d4af37' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Local Outbound Dispatch Audit Log
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'rgba(255, 255, 255, 0.45)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '10px 12px' }}>BATCH ID</th>
                  <th style={{ padding: '10px 12px' }}>TIMESTAMP</th>
                  <th style={{ padding: '10px 12px' }}>GROUP / MONTH</th>
                  <th style={{ padding: '10px 12px' }}>SENT COUNT</th>
                  <th style={{ padding: '10px 12px' }}>CHANNEL</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#d4af37' }}>{h.batchId}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255, 255, 255, 0.7)' }}>{new Date(h.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: '#fff' }}>{h.batch} ({h.month})</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#4ade80' }}>{h.totalSent} Subscribers</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255, 255, 255, 0.6)' }}>Mock BSP Sandbox</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ color: '#4ade80', fontWeight: 700 }}>✓ Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
