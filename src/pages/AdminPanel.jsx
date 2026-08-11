import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || '';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
  { id: 'bookings', label: '📅 Bookings', icon: '📅' },
  { id: 'gallery', label: '🖼️ Gallery', icon: '🖼️' },
  { id: 'pujas', label: '🪔 Pujas', icon: '🪔' },
  { id: 'courses', label: '📚 Courses', icon: '📚' },
  { id: 'shop', label: '🛍️ Shop', icon: '🛍️' },
  { id: 'users', label: '👥 Users', icon: '👥' },
];

const gold = '#d4af37';
const goldDark = '#b8860b';
const surface = '#111111';
const surfaceAlt = '#1a1a1a';
const border = 'rgba(212,175,55,0.2)';

// ─── Reusable Input ───────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)', border: `1px solid ${border}`,
  color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

function Inp({ type = 'text', ...props }) {
  return (
    <input
      type={type}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = gold}
      onBlur={e => e.target.style.borderColor = border}
      {...props}
    />
  );
}

function Textarea({ ...props }) {
  return (
    <textarea
      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
      onFocus={e => e.target.style.borderColor = gold}
      onBlur={e => e.target.style.borderColor = border}
      {...props}
    />
  );
}

function Btn({ children, onClick, variant = 'primary', size = 'md', style: s = {} }) {
  const base = {
    padding: size === 'sm' ? '6px 14px' : '10px 22px',
    borderRadius: '10px', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-heading)', fontWeight: 700,
    fontSize: size === 'sm' ? '0.78rem' : '0.9rem',
    transition: 'all 0.2s', ...s,
  };
  if (variant === 'primary') return <button onClick={onClick} style={{ ...base, background: `linear-gradient(135deg, ${gold}, ${goldDark})`, color: '#000' }}>{children}</button>;
  if (variant === 'danger') return <button onClick={onClick} style={{ ...base, background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b' }}>{children}</button>;
  return <button onClick={onClick} style={{ ...base, background: 'rgba(255,255,255,0.07)', border, color: '#fff' }}>{children}</button>;
}

function StatCard({ icon, label, value, color = gold }) {
  return (
    <motion.div whileHover={{ y: -4 }} style={{
      padding: '24px', borderRadius: '16px',
      background: `linear-gradient(145deg, ${surface}, ${surfaceAlt})`,
      border: `1px solid ${border}`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px', fontFamily: 'var(--font-body)' }}>{label}</div>
    </motion.div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function Dashboard({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setStats(d.data)).catch(() => {});
  }, [token]);

  if (!stats) return <Loading />;

  return (
    <div>
      <h2 style={sectionTitle}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <StatCard icon="👥" label="Total Users" value={stats.totalUsers} />
        <StatCard icon="📋" label="Reports Generated" value={stats.totalReports} />
        <StatCard icon="🖼️" label="Gallery Posts" value={stats.totalGalleryPosts} />
        <StatCard icon="🪔" label="Puja Services" value={stats.totalPujas} />
        <StatCard icon="📚" label="Courses" value={stats.totalCourses} />
        <StatCard icon="🛍️" label="Shop Items" value={stats.totalShopItems} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3 style={subTitle}>Recent Registrations</h3>
          <Table
            cols={['Name', 'Email', 'Role', 'Joined']}
            rows={stats.recentUsers.map(u => [u.name, u.email, u.role, new Date(u.registeredAt).toLocaleDateString('en-IN')])}
          />
        </div>
        <div>
          <h3 style={subTitle}>Recent Reports</h3>
          <Table
            cols={['Type', 'Name', 'Date']}
            rows={stats.recentReports.map(r => [r.type, r.name || '—', new Date(r.generatedAt).toLocaleDateString('en-IN')])}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────
function GalleryManager({ token }) {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  const load = () => fetch(`${API_BASE}/api/gallery`).then(r => r.json()).then(d => setPosts(d.data || []));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '' }); setImageFile(null); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, description: p.description }); setImageFile(null); setShowForm(true); };

  const save = async () => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    if (imageFile) fd.append('image', imageFile);
    const url = editing ? `${API_BASE}/api/gallery/${editing.id}` : `${API_BASE}/api/gallery`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
    setShowForm(false); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`${API_BASE}/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={sectionTitle}>Gallery Manager</h2>
        <Btn onClick={openAdd}>+ Add Post</Btn>
      </div>

      {showForm && (
        <FormCard title={editing ? 'Edit Post' : 'New Gallery Post'} onClose={() => setShowForm(false)} onSave={save}>
          <Field label="Title"><Inp value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Image"><input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }} /></Field>
        </FormCard>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {posts.map(p => (
          <div key={p.id} style={{ borderRadius: '14px', overflow: 'hidden', border, background: surfaceAlt }}>
            {p.image && (
              <img src={p.image.startsWith('/uploads') ? `${API_BASE}${p.image}` : p.image}
                alt={p.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '14px' }}>
              <div style={{ fontFamily: 'var(--font-heading)', color: gold, marginBottom: '6px' }}>{p.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>{p.description?.slice(0, 60)}...</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={() => del(p.id)}>Delete</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Puja Manager ─────────────────────────────────────────────────────────────
function PujaManager({ token }) {
  const [pujas, setPujas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', category: '', description: '', benefits: '' });
  const [imageFile, setImageFile] = useState(null);

  const load = () => fetch(`${API_BASE}/api/pujas`).then(r => r.json()).then(d => setPujas(d.data || []));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', price: '', category: '', description: '', benefits: '' }); setImageFile(null); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, price: p.price, category: p.category, description: p.description, benefits: p.benefits?.join('\n') || '' }); setImageFile(null); setShowForm(true); };

  const save = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    const url = editing ? `${API_BASE}/api/admin/pujas/${editing.id}` : `${API_BASE}/api/admin/pujas`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
    setShowForm(false); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this puja?')) return;
    await fetch(`${API_BASE}/api/admin/pujas/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={sectionTitle}>Puja Services</h2>
        <Btn onClick={openAdd}>+ Add Puja</Btn>
      </div>
      {showForm && (
        <FormCard title={editing ? 'Edit Puja' : 'New Puja Service'} onClose={() => setShowForm(false)} onSave={save}>
          <Field label="Title"><Inp value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Price"><Inp value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. ₹11,000" /></Field>
          <Field label="Category"><Inp value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Planetary Remedies" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Benefits (one per line)"><Textarea value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} placeholder="Benefit 1&#10;Benefit 2" /></Field>
          <Field label="Image"><input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }} /></Field>
        </FormCard>
      )}
      <Table
        cols={['Title', 'Price', 'Category', 'Actions']}
        rows={pujas.map(p => [
          p.title, p.price, p.category,
          <div style={{ display: 'flex', gap: '6px' }}>
            <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
            <Btn size="sm" variant="danger" onClick={() => del(p.id)}>Delete</Btn>
          </div>
        ])}
      />
    </div>
  );
}

// ─── Courses Manager ──────────────────────────────────────────────────────────
function CoursesManager({ token }) {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [postType, setPostType] = useState('youtube'); // 'youtube' or 'image'
  const [form, setForm] = useState({ title: '', description: '', icon: 'sun', youtubeUrl: '' });
  const [imageFile, setImageFile] = useState(null);

  const load = () => fetch(`${API_BASE}/api/courses`).then(r => r.json()).then(d => setCourses(d.data || []));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setPostType('youtube');
    setForm({ title: '', description: '', icon: 'sun', youtubeUrl: '' });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setPostType(c.type || (c.image ? 'image' : 'youtube'));
    setForm({ title: c.title, description: c.description || '', icon: c.icon || 'sun', youtubeUrl: c.youtubeUrl || '' });
    setImageFile(null);
    setShowForm(true);
  };

  const save = async () => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('type', postType);
    fd.append('icon', form.icon);
    fd.append('youtubeUrl', form.youtubeUrl);
    if (imageFile) fd.append('image', imageFile);

    const url = editing ? `${API_BASE}/api/admin/courses/${editing.id}` : `${API_BASE}/api/admin/courses`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });
    setShowForm(false);
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete this course post?')) return;
    await fetch(`${API_BASE}/api/admin/courses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={sectionTitle}>Academy Courses</h2>
        <Btn onClick={openAdd}>+ Add Course Post</Btn>
      </div>
      {showForm && (
        <FormCard title={editing ? 'Edit Course Post' : 'New Course Post'} onClose={() => setShowForm(false)} onSave={save}>
          <Field label="Post Type">
            <select
              value={postType}
              onChange={e => setPostType(e.target.value)}
              style={{ ...inputStyle, fontWeight: 700, color: gold }}
            >
              <option value="youtube">🎥 YouTube Video Post</option>
              <option value="image">🖼️ Normal Image Upload Post</option>
            </select>
          </Field>

          <Field label="Title"><Inp value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Course title..." /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Course overview..." /></Field>
          
          <Field label="Icon">
            <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} style={{ ...inputStyle }}>
              <option value="sun">Sun</option>
              <option value="telescope">Telescope</option>
              <option value="card">Card</option>
              <option value="star">Star</option>
            </select>
          </Field>

          {postType === 'youtube' ? (
            <Field label="YouTube Embed URL">
              <Inp value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
            </Field>
          ) : (
            <Field label="Cover Image Upload">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }} />
            </Field>
          )}
        </FormCard>
      )}
      <Table
        cols={['Title', 'Post Type', 'Icon', 'Media Status', 'Actions']}
        rows={courses.map(c => [
          <span style={{ fontWeight: 700, color: '#fff' }}>{c.title}</span>,
          <span style={{ color: c.type === 'image' ? '#00E676' : gold, fontWeight: 600 }}>
            {c.type === 'image' ? '🖼️ Image Post' : '🎥 YouTube Post'}
          </span>,
          c.icon,
          c.type === 'image' ? (c.image ? '✓ Image Attached' : '—') : (c.youtubeUrl ? '✓ Video Linked' : '—'),
          <div style={{ display: 'flex', gap: '6px' }}>
            <Btn size="sm" variant="ghost" onClick={() => openEdit(c)}>Edit</Btn>
            <Btn size="sm" variant="danger" onClick={() => del(c.id)}>Delete</Btn>
          </div>
        ])}
      />
    </div>
  );
}

// ─── Shop Manager ─────────────────────────────────────────────────────────────
function ShopManager({ token }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);

  const load = () => fetch(`${API_BASE}/api/shop`).then(r => r.json()).then(d => setItems(d.data || []));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', price: '', category: '' }); setImageFile(null); setShowForm(true); };
  const openEdit = (i) => { setEditing(i); setForm({ title: i.title, price: i.price, category: i.category }); setImageFile(null); setShowForm(true); };

  const save = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    const url = editing ? `${API_BASE}/api/admin/shop/${editing.id}` : `${API_BASE}/api/admin/shop`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
    setShowForm(false); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this shop item?')) return;
    await fetch(`${API_BASE}/api/admin/shop/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={sectionTitle}>Shop Items</h2>
        <Btn onClick={openAdd}>+ Add Item</Btn>
      </div>
      {showForm && (
        <FormCard title={editing ? 'Edit Shop Item' : 'New Shop Item'} onClose={() => setShowForm(false)} onSave={save}>
          <Field label="Title"><Inp value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Price"><Inp value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. Starting from ₹999" /></Field>
          <Field label="Category"><Inp value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. gemstones" /></Field>
          <Field label="Image"><input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }} /></Field>
        </FormCard>
      )}
      <Table
        cols={['Title', 'Price', 'Category', 'Actions']}
        rows={items.map(i => [
          i.title, i.price, i.category,
          <div style={{ display: 'flex', gap: '6px' }}>
            <Btn size="sm" variant="ghost" onClick={() => openEdit(i)}>Edit</Btn>
            <Btn size="sm" variant="danger" onClick={() => del(i.id)}>Delete</Btn>
          </div>
        ])}
      />
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersManager({ token }) {
  const [users, setUsers] = useState([]);

  const load = () => fetch(`${API_BASE}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setUsers(d.data || []));
  useEffect(() => { load(); }, [token]);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${u.name} to ${newRole}?`)) return;
    await fetch(`${API_BASE}/api/admin/users/${u.id}/role`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    load();
  };

  return (
    <div>
      <h2 style={sectionTitle}>Users ({users.length})</h2>
      <Table
        cols={['Avatar', 'Name', 'Email', 'Role', 'Registered', 'Last Login', 'Action']}
        rows={users.map(u => [
          <img src={u.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=d4af37&color=000`}
            alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />,
          u.name, u.email,
          <span style={{ color: u.role === 'admin' ? gold : 'rgba(255,255,255,0.5)', fontWeight: u.role === 'admin' ? 700 : 400 }}>
            {u.role}
          </span>,
          new Date(u.registeredAt).toLocaleDateString('en-IN'),
          new Date(u.lastLoginAt).toLocaleDateString('en-IN'),
          <Btn size="sm" variant="ghost" onClick={() => toggleRole(u)}>
            {u.role === 'admin' ? 'Make User' : 'Make Admin'}
          </Btn>
        ])}
      />
    </div>
  );
}

// ─── Bookings Manager ─────────────────────────────────────────────────────────
function BookingsManager({ token }) {
  const [bookings, setBookings] = useState([]);

  const load = () => fetch(`${API_BASE}/api/admin/bookings`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setBookings(d.data || []));
  useEffect(() => { load(); }, [token]);

  const del = async (id) => {
    if (!confirm('Delete this booking record?')) return;
    await fetch(`${API_BASE}/api/admin/bookings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <h2 style={sectionTitle}>Client Bookings ({bookings.length})</h2>
      <Table
        cols={['Client Name', 'Service', 'Date & Time', 'WhatsApp', 'Email', 'Birth Details', 'Calendar', 'Action']}
        rows={bookings.map(b => [
          <span style={{ fontWeight: 700, color: gold }}>{b.name}</span>,
          b.serviceTitle + (b.servicePrice ? ` (${b.servicePrice})` : ''),
          `${b.bookingDate} @ ${b.bookingTimeSlot}`,
          <a href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>{b.whatsapp}</a>,
          b.email || '—',
          b.birthDate ? `${b.birthDate} ${b.birthTime} (${b.birthPlace})` : '—',
          b.googleCalendarUrl ? (
            <a href={b.googleCalendarUrl} target="_blank" rel="noopener noreferrer" style={{ color: gold, textDecoration: 'underline' }}>Add to Cal 📅</a>
          ) : '—',
          <Btn size="sm" variant="danger" onClick={() => del(b.id)}>Delete</Btn>
        ])}
      />
    </div>
  );
}

// ─── Reusable Components ──────────────────────────────────────────────────────
function FormCard({ title, children, onSave, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: surface, border: `1px solid ${gold}33`, borderRadius: '16px',
        padding: '24px', marginBottom: '28px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: gold, margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem' }}>×</button>
      </div>
      {children}
      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <Btn onClick={onSave}>Save</Btn>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
      </div>
    </motion.div>
  );
}

function Table({ cols, rows }) {
  if (!rows.length) return <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', padding: '20px 0' }}>No data yet.</p>;
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(212,175,55,0.07)' }}>
            {cols.map((c, i) => (
              <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: border, whiteSpace: 'nowrap' }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid rgba(212,175,55,0.06)` }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Loading() {
  return <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>Loading...</div>;
}

const sectionTitle = { fontFamily: 'var(--font-heading)', color: gold, fontSize: '1.5rem', margin: '0 0 24px' };
const subTitle = { fontFamily: 'var(--font-heading)', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: '0 0 12px' };

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel({ setCurrentPage }) {
  const { user, token, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) return <Loading />;

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0a0a', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ fontSize: '4rem' }}>🚫</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: '#ff6b6b' }}>Access Denied</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}>Admin privileges required.</p>
        <Btn onClick={() => setCurrentPage('home')}>← Go Home</Btn>
      </div>
    );
  }

  const tabs = {
    dashboard: <Dashboard token={token} />,
    bookings: <BookingsManager token={token} />,
    gallery: <GalleryManager token={token} />,
    pujas: <PujaManager token={token} />,
    courses: <CoursesManager token={token} />,
    shop: <ShopManager token={token} />,
    users: <UsersManager token={token} />,
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#080808', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px', flexShrink: 0, background: surface,
        borderRight: `1px solid ${border}`,
        padding: '32px 0', display: 'flex', flexDirection: 'column',
      }}>
        {/* Admin badge */}
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${border}` }}>
          <img src={user.picture} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '8px', border: `2px solid ${gold}44` }} />
          <div style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.9rem' }}>{user.name}</div>
          <div style={{ fontSize: '0.7rem', color: gold, fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px' }}>ADMIN</div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '16px 0' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 20px', border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? `${gold}15` : 'transparent',
                color: activeTab === tab.id ? gold : 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 700 : 400,
                borderLeft: activeTab === tab.id ? `3px solid ${gold}` : '3px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
              onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Back to site */}
        <div style={{ marginTop: 'auto', padding: '16px 20px' }}>
          <button onClick={() => setCurrentPage('home')} style={{
            background: 'none', border: `1px solid ${border}`, color: 'rgba(255,255,255,0.4)',
            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '0.8rem', width: '100%',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = gold; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = border; }}
          >
            ← Back to Site
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tabs[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
