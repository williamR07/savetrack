'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const NEON_COLORS = ['#7C6FF7', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6']

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
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .page { padding: 20px 16px; }

  .greeting { font-size: 20px; font-weight: 600; color: #E2E2E2; margin-bottom: 2px; }
  .subtext { font-size: 12px; color: #444; margin-bottom: 20px; }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .mcard {
    background: #111113;
    border-radius: 14px;
    padding: 14px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.04);
  }

  .mcard::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    border-radius: 14px 14px 0 0;
  }

  .mcard-green::after  { background: linear-gradient(90deg, #10B981, transparent); }
  .mcard-red::after    { background: linear-gradient(90deg, #EF4444, transparent); }
  .mcard-purple::after { background: linear-gradient(90deg, #7C6FF7, #06B6D4); }

  .mcard-label { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 0.7px; font-weight: 500; margin-bottom: 8px; }
  .mcard-value { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 600; line-height: 1; }
  .mcard-sub { font-size: 10px; color: #333; margin-top: 5px; }

  .section-title { font-size: 11px; color: #444; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 500; margin-bottom: 12px; }

  .chart-card {
    background: #111113;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.04);
    padding: 16px;
    margin-bottom: 14px;
    position: relative;
    overflow: hidden;
  }

  .chart-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(124,111,247,0.5), rgba(6,182,212,0.3), transparent);
  }

  .goal-item { margin-bottom: 16px; }
  .goal-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
  .goal-name { font-size: 13px; font-weight: 500; color: #CCC; }
  .goal-pct { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; }
  .goal-amounts { font-size: 10px; color: #333; margin-bottom: 6px; }
  .progress-track { background: #1C1C1F; border-radius: 99px; height: 3px; }
  .progress-fill { height: 3px; border-radius: 99px; background: linear-gradient(90deg, #7C6FF7, #06B6D4); box-shadow: 0 0 6px rgba(124,111,247,0.5); }

  .tx-item { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .tx-item:last-child { border-bottom: none; }
  .tx-icon { width: 36px; height: 36px; border-radius: 10px; background: #1A1A1D; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 13px; color: #CCC; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 11px; color: #333; margin-top: 2px; }
  .tx-amount { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; flex-shrink: 0; }

  .empty-state { text-align: center; color: #333; font-size: 13px; padding: 32px 0; }

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

  .tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 0; }
  .tab-label { font-size: 10px; font-weight: 500; }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 100;
    display: flex;
    align-items: flex-end;
  }

  .modal {
    background: #111113;
    border: 1px solid rgba(124,111,247,0.2);
    border-radius: 24px 24px 0 0;
    padding: 24px 20px 40px;
    width: 100%;
    box-shadow: 0 -20px 60px rgba(124,111,247,0.08);
    animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  .modal-handle { width: 36px; height: 3px; background: #2A2A2E; border-radius: 99px; margin: 0 auto 20px; }
  .modal-title { font-size: 16px; font-weight: 600; color: #E2E2E2; margin-bottom: 20px; }

  .type-toggle { display: flex; background: #0A0A0C; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); overflow: hidden; margin-bottom: 12px; }
  .type-btn { flex: 1; padding: 10px; font-size: 13px; font-weight: 500; border: none; background: transparent; cursor: pointer; font-family: 'Inter', sans-serif; color: #444; }
  .type-expense { background: rgba(239,68,68,0.15); color: #EF4444; }
  .type-income  { background: rgba(16,185,129,0.15); color: #10B981; }

  .form-row { display: flex; gap: 10px; }
  .form-group { margin-bottom: 12px; flex: 1; }
  .form-label { font-size: 11px; color: #444; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; display: block; font-weight: 500; }

  .form-input, .form-select {
    width: 100%;
    background: #0A0A0C;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 11px 13px;
    font-size: 14px;
    color: #E2E2E2;
    font-family: 'Inter', sans-serif;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    transition: border-color 0.15s;
  }
  .form-input:focus, .form-select:focus { border-color: rgba(124,111,247,0.4); }
  .form-select option { background: #111113; }

  .btn-save {
    width: 100%;
    background: linear-gradient(135deg, #7C6FF7, #06B6D4);
    border: none;
    border-radius: 12px;
    padding: 14px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    margin-top: 8px;
  }
  .btn-save:disabled { opacity: 0.4; }

  .legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
  .legend-item { display: flex; align-items: flex-start; gap: 5px; font-size: 11px; color: #555; }

  .tip { background: #1A1A1E; border: 1px solid rgba(124,111,247,0.25); border-radius: 8px; padding: 8px 12px; }
  .tip-label { font-size: 10px; color: #555; margin-bottom: 3px; }
  .tip-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

  @media (min-width: 640px) {
    .page { padding: 28px 24px; max-width: 680px; margin: 0 auto; }
    .mcard-value { font-size: 24px; }
  }
`

export default function DashboardClient({ transactions, goals, categories, userId }: any) {
  const [showAdd, setShowAdd]   = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [form, setForm] = useState({ amount: '', type: 'expense', category_id: '', note: '', date: new Date().toISOString().split('T')[0] })
  const [saving, setSaving] = useState(false)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear  = now.getFullYear()
  const daysLeft = new Date(currentYear, currentMonth + 1, 0).getDate() - now.getDate()

  const monthTx  = transactions.filter((t: any) => { const d = new Date(t.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear })
  const income   = monthTx.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
  const expenses = monthTx.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
  const net      = income - expenses

  const pieData = categories
    .filter((c: any) => c.name !== 'Income')
    .map((cat: any) => ({ name: cat.name, value: monthTx.filter((t: any) => t.type === 'expense' && t.categories?.name === cat.name).reduce((s: number, t: any) => s + Number(t.amount), 0) }))
    .filter((c: any) => c.value > 0)

  const barData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(currentYear, currentMonth - 5 + i, 1)
    const txs = transactions.filter((t: any) => { const td = new Date(t.date); return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() })
    return { month: d.toLocaleString('default', { month: 'short' }), income: txs.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0), expenses: txs.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0) }
  })

  const handleSave = async () => {
    if (!form.amount || !form.category_id) return
    setSaving(true)
    await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, user_id: userId }) })
    setSaving(false)
    setShowAdd(false)
    setForm({ amount: '', type: 'expense', category_id: '', note: '', date: new Date().toISOString().split('T')[0] })
    window.location.reload()
  }

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return <div className="tip"><p className="tip-label">{label}</p>{payload.map((p: any) => <p key={p.name} className="tip-val" style={{ color: p.fill }}>{p.name}: ${p.value.toLocaleString()}</p>)}</div>
  }

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const tabs = [
    { id: 'home',    emoji: '⊞', label: 'Home' },
    { id: 'tx',      emoji: '⇅', label: 'Transactions' },
    { id: 'goals',   emoji: '◎', label: 'Goals' },
    { id: 'profile', emoji: '○', label: 'Profile' },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <span className="logo">SaveTrack</span>
          <button className="nav-add" onClick={() => setShowAdd(true)}>＋ Add</button>
        </nav>

        <div className="page">
          <h1 className="greeting">{greeting} 👋</h1>
          <p className="subtext">{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>

          <div className="metric-grid">
            <div className="mcard mcard-green">
              <p className="mcard-label">Income</p>
              <p className="mcard-value" style={{ color: '#10B981' }}>${income.toLocaleString()}</p>
              <p className="mcard-sub">This month</p>
            </div>
            <div className="mcard mcard-red">
              <p className="mcard-label">Expenses</p>
              <p className="mcard-value" style={{ color: '#EF4444' }}>${expenses.toLocaleString()}</p>
              <p className="mcard-sub">This month</p>
            </div>
            <div className="mcard mcard-purple" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p className="mcard-label">Net savings</p>
                  <p className="mcard-value" style={{ color: net >= 0 ? '#7C6FF7' : '#EF4444', fontSize: 26 }}>${net.toLocaleString()}</p>
                  <p className="mcard-sub">{net >= 0 ? '↑ On track' : '↓ Over budget'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="mcard-label">Days left</p>
                  <p className="mcard-value" style={{ color: '#06B6D4', fontSize: 26 }}>{daysLeft}</p>
                  <p className="mcard-sub">in month</p>
                </div>
              </div>
            </div>
          </div>

          <p className="section-title">Spending breakdown</p>
          <div className="chart-card">
            {pieData.length === 0 ? <div className="empty-state">No expenses this month</div> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={75} innerRadius={48} paddingAngle={2}>
                      {pieData.map((_: any, i: number) => <Cell key={i} fill={NEON_COLORS[i % NEON_COLORS.length]} stroke="transparent" />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="legend">
                  {pieData.map((d: any, i: number) => (
                    <div key={d.name} className="legend-item">
                      <div className="legend-dot" style={{ background: NEON_COLORS[i % NEON_COLORS.length] }} />
                      <span>{d.name} ${d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="section-title">6-month overview</p>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={barData} barGap={3} barSize={12}>
                <XAxis dataKey="month" tick={{ fill: '#3A3A3E', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<Tip />} />
                <Bar dataKey="income" fill="#10B981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expenses" fill="#7C6FF7" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="legend" style={{ marginTop: 8 }}>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#10B981' }} /><span>Income</span></div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#7C6FF7' }} /><span>Expenses</span></div>
            </div>
          </div>

          <p className="section-title">Savings goals</p>
          <div className="chart-card">
            {goals.length === 0 ? <div className="empty-state">No goals yet</div> : goals.map((g: any) => {
              const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100))
              return (
                <div key={g.id} className="goal-item">
                  <div className="goal-row">
                    <span className="goal-name">{g.icon} {g.name}</span>
                    <span className="goal-pct">{pct}%</span>
                  </div>
                  <p className="goal-amounts">${Number(g.current_amount).toLocaleString()} of ${Number(g.target_amount).toLocaleString()}</p>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              )
            })}
          </div>

          <p className="section-title">Recent transactions</p>
          <div className="chart-card">
            {transactions.length === 0 ? <div className="empty-state">No transactions yet</div> : transactions.slice(0, 6).map((t: any) => (
              <div key={t.id} className="tx-item">
                <div className="tx-icon">{t.categories?.icon || '💸'}</div>
                <div className="tx-info">
                  <p className="tx-name">{t.note || t.categories?.name || 'Transaction'}</p>
                  <p className="tx-meta">{t.categories?.name} · {t.date}</p>
                </div>
                <span className="tx-amount" style={{ color: t.type === 'income' ? '#10B981' : '#EF4444' }}>
                  {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="tab-bar">
          {tabs.map(tab => (
            <div key={tab.id} className="tab-item" onClick={() => setActiveTab(tab.id)}>
              <span style={{ fontSize: 20, color: activeTab === tab.id ? '#7C6FF7' : '#2A2A2E' }}>{tab.emoji}</span>
              <span className="tab-label" style={{ color: activeTab === tab.id ? '#7C6FF7' : '#2A2A2E' }}>{tab.label}</span>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="modal-overlay" onClick={() => setShowAdd(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <p className="modal-title">New transaction</p>

              <div className="type-toggle">
                <button className={`type-btn ${form.type === 'expense' ? 'type-expense' : ''}`} onClick={() => setForm({ ...form, type: 'expense' })}>Expense</button>
                <button className={`type-btn ${form.type === 'income' ? 'type-income' : ''}`} onClick={() => setForm({ ...form, type: 'income' })}>Income</button>
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <input className="form-input" type="number" inputMode="decimal" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ fontSize: 22, fontFamily: 'JetBrains Mono', fontWeight: 600 }} />
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
                  <input className="form-input" type="text" placeholder="Optional" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>

              <button className="btn-save" onClick={handleSave} disabled={saving || !form.amount || !form.category_id}>
                {saving ? 'Saving…' : 'Save transaction'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
