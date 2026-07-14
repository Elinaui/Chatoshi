import { useState } from 'react'
import './AlertsView.css'

const defaultAlerts = [
  {
    category: 'Price Drops',
    items: [
      { label: 'BTC drops 10% in 24h', enabled: false },
      { label: 'ETH drops 10% in 24h', enabled: false },
    ],
  },
  {
    category: 'Price Increases',
    items: [
      { label: 'BTC rises 10% in 24h', enabled: false },
      { label: 'ETH rises 12% in 24h', enabled: true },
    ],
  },
  {
    category: 'All-Time Highs',
    items: [
      { label: 'BTC reaches a new ATH', enabled: false },
      { label: 'ETH reaches a new ATH', enabled: false },
    ],
  },
  {
    category: 'Down from ATH',
    items: [
      { label: 'BTC drops 10% below its ATH', enabled: false },
      { label: 'ETH drops 50% below its ATH', enabled: false },
    ],
  },
  {
    category: 'Target Price',
    items: [
      { label: 'ETH reaches $7K', enabled: false },
      { label: 'ETH reaches $5K', enabled: false },
    ],
  },
  {
    category: 'Social Media',
    items: [
      { label: 'Becker mentions BTC', enabled: false },
      { label: 'Ansem mentions SOL', enabled: false },
    ],
  },
]

export default function AlertsView() {
  const [tab, setTab] = useState('alerts')
  const [alerts, setAlerts] = useState(() =>
    defaultAlerts.map(cat => ({
      ...cat,
      items: cat.items.map(item => ({ ...item })),
    }))
  )

  const toggle = (catIdx, itemIdx) => {
    setAlerts(prev => {
      const next = prev.map((cat, ci) =>
        ci === catIdx
          ? { ...cat, items: cat.items.map((item, ii) => ii === itemIdx ? { ...item, enabled: !item.enabled } : item) }
          : cat
      )
      return next
    })
  }

  const enableAll = (catIdx) => {
    setAlerts(prev => prev.map((cat, ci) =>
      ci === catIdx ? { ...cat, items: cat.items.map(i => ({ ...i, enabled: true })) } : cat
    ))
  }

  return (
    <div className="page-view alerts-view">
      <div className="page-header">
        <h2>Alerts</h2>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'alerts' ? 'active' : ''}`} onClick={() => setTab('alerts')}>Alerts</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
      </div>

      {tab === 'alerts' && (
        <div className="alerts-content">
          <div className="alerts-section">
            <div className="alerts-section-hdr">
              <span className="alerts-section-title">Custom Alerts</span>
              <button className="add-alert-btn">
                <PlusIcon /> Add custom alert
              </button>
            </div>
            <div className="empty-custom">
              <span>You don't have any custom alerts yet.</span>
            </div>
          </div>

          <div className="alerts-section">
            <div className="alerts-section-hdr">
              <span className="alerts-section-title">Default Alerts</span>
              <button className="add-all-btn" onClick={() => alerts.forEach((_, i) => enableAll(i))}>Add all</button>
            </div>

            {alerts.map((cat, catIdx) => (
              <div key={cat.category} className="alert-category">
                <div className="alert-cat-header">
                  <span className="alert-cat-name">{cat.category}</span>
                  <button className="cat-add-all" onClick={() => enableAll(catIdx)}>+ Add all</button>
                </div>
                {cat.items.map((item, itemIdx) => (
                  <div key={item.label} className="alert-item">
                    <span className="alert-label">{item.label}</span>
                    <button
                      className={`toggle ${item.enabled ? 'on' : 'off'}`}
                      onClick={() => toggle(catIdx, itemIdx)}
                      aria-label={item.enabled ? 'Disable' : 'Enable'}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="alerts-content">
          <div className="empty-state">
            <BellIcon />
            <p>No alert history yet</p>
            <span>Your triggered alerts will appear here</span>
          </div>
        </div>
      )}
    </div>
  )
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}
function BellIcon() {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 4c-5 0-9 4-9 9v8l-2 2V24h22v-1l-2-2v-8c0-5-4-9-9-9Z" stroke="currentColor" strokeWidth="1.8" /><path d="M13 24c0 1.66 1.34 3 3 3s3-1.34 3-3" stroke="currentColor" strokeWidth="1.8" /></svg>
}
