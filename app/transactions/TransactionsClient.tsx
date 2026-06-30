'use client'

import { useState, useMemo } from 'react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0A0A0C; color: #E2E2E2; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  .app { min-height: 100vh; background: #0A0A0C; padding-bottom: 90px; }

  .nav {
    background: rgba(10,10,12,0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(124,111,247,0.12);
    padding: 0 18px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .logo {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    background: linear-gradient(90deg, #7C6FF7, #06B6D4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-add {
    background: linear-gradient(135deg, #7C6FF7, #06B6D4);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }

  .page { padding: 20px 16px; }

  .page-title { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
  .page-sub { font-size: 12px; color: #444; margin-bottom: 18px; }

  /* Filters */
  .filter-row { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 18px; padding-bottom: 2px; }
  .filter-row::-webkit-scrollbar { display: none; }
  .filter-chip {
    flex-shrink: 0;
    padding: 7px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: #111113;
    border: 1px solid rgba(255,255,255,0.06);
    color: #555;
    cursor: pointer;
    white-space: nowrap;
  }
  .filter-chip-active {
    background: rgba(124,111,247,0.15);
    border-color: rgba(124,111,247,0.4);
    color: #A599FA;
  }

  .search-input {
    width: 100%;
    background: #111113;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14px;
    color: #E2E2E2;
    font-family: 'Inter', sans-serif;
    outline: none;
    margin-bottom: 14px;
  }
  .search-input:focus { border-color: rgba(124,111,247,0.4); }
  .search-input::placeholder { color: #3A3A3E; }

  /* Group */
  .day-group { margin-bottom: 18px; }
  .day-label { font-size: 11px; color: #444; text-transform: uppercase; letter-spacing: 0.7px; font-weight: 500; margin-bottom: 10px; }

  .tx-card {
    background: #111113;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 8px;
    overflow: hidden;
  }

  .tx-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 14px;
    cursor: pointer;
  }

  .tx-icon { width: 38px; height: 38px; border-radius: 11px; background: #1A1A1D; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 13.5px; color: #DDD; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 11px; color: #3A3A3E; margin-top: 2px; }
  .tx-amount { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; flex-shrink: 0; }

  .swipe-actions { display: flex; }
  .action-btn { flex: 1; padding: 11px; text-align: center; font-size: 12px; font-weight: 500; border: none; cursor: pointer; font-family: 'Inter', sans-serif; }
  .action-edit { background: rgba(124,111,247,0.12); color: #A599FA; }
  .action-delete { background: rgba(239,68,68,0.12); color: #F87171; }

  .empty-state { text-align: center; color: #333; font-size: 13px; padding: 60px 0; }
  .empty-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.4; }

  .summary-bar {
    display: flex;
    justify-content: space-between;
    background: #111113;
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 18px;
  }
  .summary-item { text-align: center; flex: 1; }
  .summary-label { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
  .summary-value { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; }
  .summary-divider { width: 1px; background: rgba(255,255,255,0.06); margin: 0 4px; }

  /* Tab bar */
  .tab-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(10,10,12,0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(124,111,247,0.1);
    display: flex;
    padding: 8px 0 20px;
    z-index: 50;
  }
  .tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 0; text-decoration: none; }
  .tab-label { font-size: 10px; font-weight: 500; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 100; display: flex; align-items: flex-end;
  }
  .modal {
    background: #111113;
    border: 1px solid rgba(124,111,247,0.2);
    border-radius: 24px 24px 0 0;
    padding: 24px 20px 40px;
    width: 100%;
    animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-handle { width: 36px; height: 3px; background: #2A2A2E; border-radius: 99px; margin: 0 auto 20px; }
  .modal-title { font-size: 16px; font-weight: 600; margin-bottom: 20px; }

  .type-toggle { display: flex; background: #0A0A0C; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); overflow: hidden; margin-bottom: 12px; }
  .type-btn { flex: 1; padding: 10px; font-size: 13px; font-weight: 500; border: none; background: transparent; cursor: pointer; font-family: 'Inter', sans-serif; color: #444; }
  .type-expense { background: rgba(239,68,68,0.15); color: #EF4444; }
  .type-income { background: rgba(16,185,129,0.15); color: #10B981; }

  .form-row { display: flex; gap: 10px; }
  .form-group { margin-bottom: 12px; flex: 1; }
  .form-label { font-size: 11px; color: #444; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; display: block; font-weight: 500; }
  .form-input, .form-select {
    width: 100%; background: #0A0A0C; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; padding: 11px 13px; font-size: 14px; color: #E2E2E2;
    font-family: 'Inter', sans-serif; outline: none; -webkit-appearance: none; appearance: none;
  }
  .form-input:focus, .form-select:focus { border-color: rgba(124,111,247,0.4); }
  .form-select option { background: #111113; }

  .btn-save { width: 100%; background: linear-gradient(135deg, #7C6FF7, #06B6D4); border: none; border-radius: 12px; padding: 14px; color: white; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; margin-top: 8px; }
  .btn-save:disabled { opacity: 0.4; }
  .btn-delete-confirm { width: 100%; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); border-radius: 12px; padding: 14px; color: #F87171; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; margin-top: 10px; }

  @media (min-width: 640px) {
    .page { padding: 28px 24px; max-width: 680px; margin: 0 auto; }
  }
`

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })
}

export default function TransactionsClient({ initialTransactions, categories, userId }: any) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingTx, setEditingTx] = useState<any>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ amount: '', type: 'expense', category_id: '', note: '', date: '' })

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (filter === 'income') list = list.filter(t => t.type === 'income')
    if (filter === 'expense') list = list.filter(t => t.type === 'expense')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        (t.note || '').toLowerCase().includes(q) ||
        (t.categories?.name || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [transactions, filter, search])

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {}
    filtered.forEach(t => {
      const label = formatDateLabel(t.date)
      if (!groups[label]) groups[label] = []
      groups[label].push(t)
    })
    return groups
  }, [filtered])

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  const openEdit = (t: any) => {
    setEditingTx(t)
    setForm({
      amount: String(t.amount),
      type: t.type,
      category_id: t.category_id || '',
      note: t.note || '',
      date: t.date
    })
    setConfirmDeleteId(null)
  }

  const handleUpdate = async () => {
    if (!form.amount || !form.category_id) return
    setSaving(true)
    await fetch('/api/transactions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingTx.id, ...form })
    })
    setSaving(false)
    setEditingTx(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    setSaving(true)
    await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })
    setTransactions((prev: any[]) => prev.filter(t => t.id !== id))
    setSaving(false)
    setEditingTx(null)
    setConfirmDeleteId(null)
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <span className="logo">SaveTrack</span>
          <a href="/dashboard" className="nav-add" style={{ textDecoration: 'none' }}>← Dashboard</a>
        </nav>

        <div className="page">
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>

          <div className="summary-bar">
            <div className="summary-item">
              <p className="summary-label">Income</p>
              <p className="summary-value" style={{ color: '#10B981' }}>${totalIncome.toLocaleString()}</p>
            </div>
            <div className="summary-divider" />
            <div className="summary-item">
              <p className="summary-label">Expenses</p>
              <p className="summary-value" style={{ color: '#EF4444' }}>${totalExpense.toLocaleString()}</p>
            </div>
            <div className="summary-divider" />
            <div className="summary-item">
              <p className="summary-label">Net</p>
              <p className="summary-value" style={{ color: '#7C6FF7' }}>${(totalIncome - totalExpense).toLocaleString()}</p>
            </div>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="filter-row">
            {[
              { id: 'all', label: 'All' },
              { id: 'income', label: 'Income' },
              { id: 'expense', label: 'Expenses' },
            ].map(f => (
              <div
                key={f.id}
                className={`filter-chip ${filter === f.id ? 'filter-chip-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </div>
            ))}
          </div>

          {Object.keys(grouped).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No transactions found</p>
            </div>
          ) : Object.entries(grouped).map(([label, txs]) => (
            <div key={label} className="day-group">
              <p className="day-label">{label}</p>
              {txs.map(t => (
                <div key={t.id} className="tx-card">
                  <div className="tx-row" onClick={() => openEdit(t)}>
                    <div className="tx-icon">{t.categories?.icon || '💸'}</div>
                    <div className="tx-info">
                      <p className="tx-name">{t.note || t.categories?.name || 'Transaction'}</p>
                      <p className="tx-meta">{t.categories?.name}</p>
                    </div>
                    <span className="tx-amount" style={{ color: t.type === 'income' ? '#10B981' : '#EF4444' }}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="tab-bar">
          <a href="/dashboard" className="tab-item">
            <span style={{ fontSize: 20, color: '#2A2A2E' }}>⊞</span>
            <span className="tab-label" style={{ color: '#2A2A2E' }}>Home</span>
          </a>
          <div className="tab-item">
            <span style={{ fontSize: 20, color: '#7C6FF7' }}>⇅</span>
            <span className="tab-label" style={{ color: '#7C6FF7' }}>Transactions</span>
          </div>
          <a href="/goals" className="tab-item">
            <span style={{ fontSize: 20, color: '#2A2A2E' }}>◎</span>
            <span className="tab-label" style={{ color: '#2A2A2E' }}>Goals</span>
          </a>
          <div className="tab-item">
            <span style={{ fontSize: 20, color: '#2A2A2E' }}>○</span>
            <span className="tab-label" style={{ color: '#2A2A2E' }}>Profile</span>
          </div>
        </div>

        {editingTx && (
          <div className="modal-overlay" onClick={() => { setEditingTx(null); setConfirmDeleteId(null) }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <p className="modal-title">Edit transaction</p>

              <div className="type-toggle">
                <button className={`type-btn ${form.type === 'expense' ? 'type-expense' : ''}`} onClick={() => setForm({ ...form, type: 'expense' })}>Expense</button>
                <button className={`type-btn ${form.type === 'income' ? 'type-income' : ''}`} onClick={() => setForm({ ...form, type: 'income' })}>Income</button>
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <input className="form-input" type="number" inputMode="decimal" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ fontSize: 22, fontFamily: 'JetBrains Mono', fontWeight: 600 }} />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Note</label>
                  <input className="form-input" type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>

              <button className="btn-save" onClick={handleUpdate} disabled={saving || !form.amount || !form.category_id}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>

              {confirmDeleteId === editingTx.id ? (
                <button className="btn-delete-confirm" onClick={() => handleDelete(editingTx.id)} disabled={saving}>
                  Tap again to confirm delete
                </button>
              ) : (
                <button className="btn-delete-confirm" onClick={() => setConfirmDeleteId(editingTx.id)}>
                  Delete transaction
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
