import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './AlphaView.css'

const ALPHA_ITEMS = [
  { id: 1, emoji: '🚀', text: 'New trending coin detected: debtreliefbot', time: 'Today, 11:45 AM', read: false },
  { id: 2, emoji: '💸', text: 'New trending coin detected: crcl',            time: 'Jul 1, 3:40 PM',    read: false },
  { id: 3, emoji: '👀', text: 'New trending coin detected: dmcqxt...mxhf3p', time: 'Jul 1, 11:45 AM',   read: false },
  { id: 4, emoji: '🔥', text: 'New trending coin detected: debtreliefbot',   time: 'Jun 30, 11:45 AM',  read: true  },
  { id: 5, emoji: '💣', text: 'New trending coin detected: #bobo',           time: 'Jun 1, 11:21 PM',   read: true  },
  { id: 6, emoji: '💵', text: 'New trending coin detected: debtreliefbot',   time: 'Jun 30, 11:45 AM',  read: true  },
  { id: 7, emoji: '🪄', text: 'New trending coin detected: #bobo',           time: 'Jun 1, 11:21 PM',   read: true  },
]

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

function AlphaContextMenu({ pos, onClose }) {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  return createPortal(
    <div ref={ref} className="alv-ctx-menu" style={{ top: pos.top, left: pos.left }}>
      <button className="alv-ctx-item alv-ctx-item--sep" onClick={onClose}>
        <span className="msi msi-sm alv-ctx-icon">check</span>
        Select
      </button>
      <button className="alv-ctx-item" onClick={onClose}>
        <span className="msi msi-sm alv-ctx-icon">delete</span>
        Delete
      </button>
    </div>,
    document.body
  )
}

function AlphaCard({ item, onCardClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  const openMenu = e => {
    e.stopPropagation()
    const rect = btnRef.current.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 220 })
    setMenuOpen(m => !m)
  }

  return (
    <div className="alv-card" onClick={onCardClick}>
      <span className={`alv-indicator${item.read ? ' alv-indicator--read' : ''}`} />
      <div className="alv-content">
        <p className={`alv-text${item.read ? ' alv-text--read' : ''}`}>
          {item.emoji} {item.text}
        </p>
        <span className={`alv-time${item.read ? ' alv-time--read' : ''}`}>{item.time}</span>
      </div>
      <button
        ref={btnRef}
        className={`alv-more${menuOpen ? ' alv-more--active' : ''}`}
        onClick={openMenu}
      >
        <span className="msi">more_horiz</span>
      </button>
      {menuOpen && (
        <AlphaContextMenu pos={menuPos} onClose={() => setMenuOpen(false)} />
      )}
    </div>
  )
}

function AlphaDetailView({ item, onBack }) {
  return (
    <div className="alv-shell">
      <div className="alv-topbar alv-topbar--detail">
        <button className="alv-back-btn" onClick={onBack}>
          <span className="msi">arrow_left_alt</span>
        </button>
        <h1 className="alv-heading">Alpha</h1>
      </div>
      <div className="alv-body">
        <div className="alv-inner alv-inner--detail">
          <div className="alv-detail-top">
            <span className="alv-detail-ts">{item.time}</span>
            <h2 className="alv-detail-h4">{item.emoji} {item.text}</h2>
          </div>

          <div className="alv-metrics-card">
            <div className="alv-metrics-grid">
              <div className="alv-metric">
                <span className="alv-metric-label">Asset Type</span>
                <span className="alv-metric-value">memecoin</span>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">Contract Address</span>
                <div className="alv-metric-addr">
                  <span className="alv-metric-link">0xbb4C...bc095c</span>
                  <span className="msi msi-sm" style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>content_copy</span>
                </div>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">Price</span>
                <span className="alv-metric-value">$0.0000582</span>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">Market Cap</span>
                <span className="alv-metric-value">$5.82M</span>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">24h Volume</span>
                <span className="alv-metric-value">$727K</span>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">
                  Moved (<span className="alv-metric-label--medium">since trending start</span>)
                </span>
                <div className="alv-metric-stat">
                  <span className="msi" style={{ color: 'var(--success)', fontSize: 24 }}>arrow_upward_alt</span>
                  <span className="alv-metric-stat-value">37.17%</span>
                </div>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">First Activity</span>
                <span className="alv-metric-value">3h ago</span>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">Growth Potential</span>
                <span className="alv-metric-value">High</span>
              </div>
              <div className="alv-metric">
                <span className="alv-metric-label">Chain</span>
                <span className="alv-metric-value">Base</span>
              </div>
            </div>
          </div>

          <div className="alv-detail-desc">
            <p><span className="alv-detail-link">$DRB</span> is sharply trending because Grok's Base wallet was socially engineered into sending 3B DRB (~$150k+) to an attacker, a high‑profile prompt‑injection incident that ties AI agents directly to on‑chain loss.</p>
            <p>The DRB contract itself on Base is a clean, established ERC‑20 and the drama centers on Grok/xAI's wallet and intent‑parsing security, not on a team rug or contract backdoor.</p>
            <p>Given the incident is only a few hours old, is now on X trending pages, and is being actively dissected by AI, Base, and security communities, mentions and speculative interest are likely to keep climbing in the near term even as price remains volatile and fundamentally risky due to concentrated holdings and recent dumping.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlphaView({ onMenuClick }) {
  const [selectedItem, setSelectedItem] = useState(null)

  if (selectedItem) {
    return <AlphaDetailView item={selectedItem} onBack={() => setSelectedItem(null)} />
  }

  return (
    <div className="alv-shell">
      <div className="alv-topbar">
        <button className="pg-menu-btn" onClick={onMenuClick} title="Menu">
          <span className="msi">menu</span>
        </button>
        <h1 className="alv-heading">Alpha</h1>
      </div>
      <div className="alv-body">
        <div className="alv-inner">
          <div className="alv-list">
            {ALPHA_ITEMS.map(item => (
              <AlphaCard key={item.id} item={item} onCardClick={() => setSelectedItem(item)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
