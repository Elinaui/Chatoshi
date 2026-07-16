import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import coinBTC from '../assets/coins/btc.svg'
import coinETH from '../assets/coins/eth.svg'
import coinBNB from '../assets/coins/bnb.svg'
import coinSOL from '../assets/coins/sol.svg'
import './AlertsView.css'

const COIN_IMGS = { BTC: coinBTC, ETH: coinETH, BNB: coinBNB, SOL: coinSOL }

const FIGMA_ANSEM_AVATAR = 'https://www.figma.com/api/mcp/asset/8ecf6e16-abdd-44b0-b561-30b7a30c0f02'
const FIGMA_X_LOGO = 'https://www.figma.com/api/mcp/asset/c9814bda-ac10-4de9-b29a-a590b624d333'
const FIGMA_TWEET_STATS = 'https://www.figma.com/api/mcp/asset/808e945f-758b-49b1-8ee6-583bb598c49c'
const FIGMA_INFLUENCER_THUMB = 'https://www.figma.com/api/mcp/asset/fb8556a3-65a8-43a9-a3bb-59765bfdd385'
const FIGMA_ICON_YOUTUBE = 'https://www.figma.com/api/mcp/asset/d413f65f-1cff-46c5-88eb-43c1b7b1009f'
const FIGMA_ICON_PATREON = 'https://www.figma.com/api/mcp/asset/c117263e-ba21-475d-9c21-e0e78eeee953'
const FIGMA_ICON_X_SM = 'https://www.figma.com/api/mcp/asset/8d471a1f-40c0-4abf-b0f7-0378660156d1'

const EXPLORE_SUGGESTIONS = [
  'What is the market cap for BTC?',
  'What can I buy with my BTC?',
  'How is MATIC performing this week?',
  'Suggest a balanced portfolio allocation.',
]

function CoinIcon({ coin }) {
  const src = COIN_IMGS[coin]
  if (src) return <img src={src} alt={coin} className="av-coin-icon" />
  return <span className="av-coin-icon av-coin-icon--fallback">{coin?.[0]}</span>
}

function CustomAlertModal({ onClose }) {
  return createPortal(
    <div className="av-modal-overlay" onClick={onClose}>
      <div className="av-modal" onClick={e => e.stopPropagation()}>
        <div className="av-modal-header">
          <div className="av-modal-close-wrap">
            <button className="av-modal-close" onClick={onClose}>
              <span className="msi">close</span>
            </button>
          </div>
        </div>
        <div className="av-modal-body">
          <div className="av-modal-icon-wrap">
            <span className="msi av-modal-icon">notifications_active</span>
          </div>
          <div className="av-modal-text">
            <h2 className="av-modal-title">How does this work?</h2>
            <p className="av-modal-desc">
              Want something specific? Just type a prompt like:{' '}
              <br />
              <strong>"Alert me when SOL drops 20% in a day"</strong> and we'll set that up for you automatically.
            </p>
            <p className="av-modal-desc">
              You can create alerts based on price moves. Just tell us what you want to track!
            </p>
          </div>
          <button className="av-modal-cta">Set an alert</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

const HISTORY_ROWS = [
  { id: 'price', icon: 'notifications', label: 'Price alert', date: 'Today, 11:45 AM', count: 3 },
  { id: 'social', icon: 'campaign', label: 'Social media', date: 'May 29, 2:30 PM', count: 2 },
]

const PRICE_CHIPS = ['All', 'Price drops', 'Price increases', 'All-time highs', 'Down from ATH', 'Market cap', 'High volume']

const PRICE_ALERTS = [
  {
    group: 'Today',
    items: [
      { id: 1, coin: 'BTC', title: 'BTC dropped 10% in 24h', price: '$82,400 → $74,100', trend: 'trending_down', trendColor: 'error', time: '11:45 AM', read: false },
      { id: 2, coin: 'ETH', title: 'ETH is 12% up', price: '$3,200 → $3,584', trend: 'trending_up', trendColor: 'success', time: '11:20 AM', read: false },
    ],
  },
  {
    group: 'Yesterday',
    items: [
      { id: 3, coin: 'BNB', title: 'BNB hit your target price', price: '$75,214', trend: 'autorenew', trendColor: 'tertiary', time: 'Jul 1, 3:40 PM', read: false },
      { id: 4, coin: 'SOL', title: 'SOL made a new ATH', price: '$109,400', trend: 'autorenew', trendColor: 'tertiary', time: 'Jul 1, 3:40 PM', read: true },
    ],
  },
  {
    group: 'This week',
    items: [
      { id: 5, coin: 'SOL', title: 'SOL dropped 10% in a day', price: '$3,200 → $3,584', trend: 'trending_down', trendColor: 'error', time: 'Jun 29, 12:20 AM', read: true },
      { id: 6, coin: 'BTC', title: 'BTC is 10% below ATH', price: '$82,400 → $74,100', trend: null, time: 'Jun 29, 10:12 PM', read: true },
    ],
  },
  {
    group: 'June',
    items: [
      { id: 7, coin: 'BNB', title: 'BNB is 10% below ATH', price: '$82,400 → $74,100', trend: null, time: 'Jun 20, 11:45 AM', read: true },
      { id: 8, coin: 'SOL', title: 'SOL made a new ATH', price: '$109,400', trend: null, time: 'Jun 12, 11:45 AM', read: true },
      { id: 9, coin: 'ETH', title: 'ETH is 12% up', price: '$3,200 → $3,584', trend: 'trending_up', trendColor: 'success', time: 'Jun 10, 11:45 AM', read: true },
    ],
  },
]

const SOCIAL_ALERTS = [
  {
    group: 'Yesterday',
    items: [
      { id: 1, coin: 'BTC', title: 'Ansem mentioned BTC', time: 'May 29, 2:30 PM', read: false },
      { id: 2, coin: 'ETH', title: 'Becker mentioned ETH', time: 'May 29, 3:29 PM', read: false },
    ],
  },
  {
    group: 'This week',
    items: [
      { id: 3, coin: 'ETH', title: 'Becker mentioned ETH', time: 'Jul 1, 3:40 PM', read: true },
      { id: 4, coin: 'SOL', title: 'Becker mentioned SOL', time: 'Jul 1, 3:40 PM', read: true },
    ],
  },
  {
    group: 'June',
    items: [
      { id: 5, coin: 'BTC', title: 'Ansem mentioned BTC', time: 'Jun 29, 12:20 AM', read: true },
      { id: 6, coin: 'SOL', title: 'Ansem mentioned SOL', time: 'Jun 29, 3:40 PM', read: true },
    ],
  },
]

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

function NotifContextMenu({ menuType, pos, onClose }) {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  const items = menuType === 'price'
    ? [
        { icon: 'check', label: 'Mark as read' },
        { icon: 'autorenew', label: 'Keep alert repeating' },
        { icon: 'check', label: 'Select' },
        { icon: 'delete', label: 'Delete' },
      ]
    : [
        { icon: 'check', label: 'Mark as read' },
        { icon: 'check', label: 'Select' },
        { icon: 'delete', label: 'Delete' },
      ]

  return createPortal(
    <div ref={ref} className="av-ctx-menu" style={{ top: pos.top, left: pos.left }}>
      {items.map((item, i) => (
        <button
          key={i}
          className={`av-ctx-item${i < items.length - 1 ? ' av-ctx-item--sep' : ''}`}
          onClick={onClose}
        >
          <span className="msi msi-sm av-ctx-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  )
}

function NotifCard({ item, menuType, onClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  const openMenu = e => {
    e.stopPropagation()
    const rect = btnRef.current.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, left: rect.left - 180 })
    setMenuOpen(m => !m)
  }

  const trendColor =
    item.trendColor === 'success' ? 'var(--success)' :
    item.trendColor === 'error' ? 'var(--error)' :
    'var(--text-tertiary)'

  return (
    <div className={`av-notif-card${item.read ? '' : ' av-notif-card--unread'}`} onClick={onClick}>
      <div className="av-notif-content">
        <CoinIcon coin={item.coin} />
        <div className="av-notif-text">
          <span className={`av-notif-title${item.read ? ' av-notif-title--read' : ''}`}>{item.title}</span>
          {item.price && <span className="av-notif-price">{item.price}</span>}
        </div>
        {item.trend && (
          <span className="msi msi-sm" style={{ color: trendColor, flexShrink: 0 }}>{item.trend}</span>
        )}
        <span className="av-notif-time">{item.time}</span>
      </div>
      <button ref={btnRef} className="av-notif-more" onClick={openMenu}>
        <span className="msi">more_horiz</span>
      </button>
      {menuOpen && (
        <NotifContextMenu menuType={menuType} pos={menuPos} onClose={() => setMenuOpen(false)} />
      )}
    </div>
  )
}

function ExploreWithChat() {
  return (
    <div className="av-explore">
      <h2 className="av-explore-title">Explore with chat</h2>
      <div className="av-try-rows">
        {EXPLORE_SUGGESTIONS.map((text, i) => (
          <div key={i} className="av-try-row">
            <span className="av-try-text">{text}</span>
            <button className="av-try-arrow">
              <span className="msi">keyboard_arrow_right</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PriceAlertDetailView({ item, onBack }) {
  const trendColor =
    item.trendColor === 'success' ? 'var(--success)' :
    item.trendColor === 'error' ? 'var(--error)' :
    'var(--text-tertiary)'

  return (
    <div className="av-shell">
      <div className="av-topbar av-topbar--detail">
        <button className="av-back-btn" onClick={onBack}>
          <span className="msi">arrow_left_alt</span>
        </button>
        <h1 className="av-heading">Alert details</h1>
      </div>
      <div className="av-body">
        <div className="av-inner av-inner--detail">
          <div className="av-detail-body">
            <div className="av-detail-notif">
              <div className="av-detail-text">
                <span className="av-detail-ts">{item.time}</span>
                <div className="av-detail-title-row">
                  <CoinIcon coin={item.coin} />
                  <h2 className="av-detail-h3">{item.title}</h2>
                  {item.trend && (
                    <span className="msi msi-sm" style={{ color: trendColor, flexShrink: 0 }}>{item.trend}</span>
                  )}
                </div>
                {item.price && <span className="av-detail-price">{item.price}</span>}
              </div>
              <div className="av-detail-actions">
                <button className="av-detail-btn av-detail-btn--primary">Set new custom alert</button>
                <button className="av-detail-btn av-detail-btn--secondary">Keep alert repeating</button>
                <button className="av-detail-btn av-detail-btn--secondary">View alert chat</button>
              </div>
            </div>
            <div className="av-thick-divider" />
            <ExploreWithChat />
          </div>
        </div>
      </div>
    </div>
  )
}

function TweetCard() {
  return (
    <div className="av-tweet-card">
      <div className="av-tweet-header">
        <div className="av-tweet-account">
          <img src={FIGMA_ANSEM_AVATAR} alt="Ansem" className="av-tweet-avatar" />
          <div className="av-tweet-name-wrap">
            <span className="av-tweet-name">Ansem</span>
            <span className="av-tweet-handle">@blknoiz06</span>
          </div>
        </div>
        <img src={FIGMA_X_LOGO} alt="X" className="av-tweet-xlogo" />
      </div>
      <p className="av-tweet-body">
        Funniest thing about old bitcoin wallets waking up are the ppl in the comments like "well why would they sell now" bro they turned $1k into one billion dollars what are you talking about
      </p>
      <div className="av-tweet-footer">
        <span className="av-tweet-time">11:38 AM • May 27, 2026</span>
        <span className="msi msi-sm" style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>info</span>
      </div>
      <img src={FIGMA_TWEET_STATS} alt="" className="av-tweet-stats" />
    </div>
  )
}

function InfluencerCard() {
  return (
    <div className="av-influencer-card">
      <div className="av-influencer-top">
        <div className="av-influencer-thumb-wrap">
          <img src={FIGMA_INFLUENCER_THUMB} alt="" className="av-influencer-thumb" />
          <div className="av-influencer-thumb-grad" />
        </div>
        <div className="av-influencer-info">
          <div className="av-influencer-text">
            <h3 className="av-influencer-name">Vitalik Buterin</h3>
            <p className="av-influencer-role">Co-founder of Ethereum</p>
          </div>
          <span className="av-influencer-tag">Individual</span>
        </div>
      </div>
      <div className="av-influencer-bottom">
        <button className="av-influencer-social-btn">
          <span className="msi" style={{ color: 'var(--text-secondary)', fontSize: 24 }}>language</span>
        </button>
        <button className="av-influencer-social-btn">
          <img src={FIGMA_ICON_X_SM} alt="X" className="av-influencer-social-img" />
        </button>
        <button className="av-influencer-social-btn">
          <img src={FIGMA_ICON_YOUTUBE} alt="YouTube" className="av-influencer-social-img" />
        </button>
        <button className="av-influencer-social-btn">
          <img src={FIGMA_ICON_PATREON} alt="Patreon" className="av-influencer-social-img" />
        </button>
      </div>
    </div>
  )
}

function SocialAlertDetailView({ item, onBack }) {
  return (
    <div className="av-shell">
      <div className="av-topbar av-topbar--detail">
        <button className="av-back-btn" onClick={onBack}>
          <span className="msi">arrow_left_alt</span>
        </button>
        <h1 className="av-heading">Alert details</h1>
      </div>
      <div className="av-body">
        <div className="av-inner av-inner--detail">
          <div className="av-detail-body">
            <div className="av-detail-notif">
              <div className="av-detail-text">
                <span className="av-detail-ts">{item.time}</span>
                <div className="av-detail-title-row">
                  <CoinIcon coin={item.coin} />
                  <h2 className="av-detail-h3">{item.title}</h2>
                </div>
              </div>
              <div className="av-detail-info">
                <TweetCard />
                <InfluencerCard />
              </div>
              <div className="av-detail-actions">
                <button className="av-detail-btn av-detail-btn--primary">Set new custom alert</button>
                <button className="av-detail-btn av-detail-btn--secondary">Keep alert repeating</button>
                <button className="av-detail-btn av-detail-btn--secondary">View alert chat</button>
              </div>
            </div>
            <div className="av-thick-divider" />
            <ExploreWithChat />
          </div>
        </div>
      </div>
    </div>
  )
}

function PriceAlertsView({ onBack }) {
  const [activeChip, setActiveChip] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  if (selectedItem) {
    return <PriceAlertDetailView item={selectedItem} onBack={() => setSelectedItem(null)} />
  }

  return (
    <div className="av-shell">
      <div className="av-topbar av-topbar--detail">
        <button className="av-back-btn" onClick={onBack}>
          <span className="msi">arrow_left_alt</span>
        </button>
        <h1 className="av-heading">Price alerts</h1>
      </div>
      <div className="av-body">
        <div className="av-inner">
          <div className="av-chips">
            {PRICE_CHIPS.map(chip => (
              <button
                key={chip}
                className={`av-chip${activeChip === chip ? ' av-chip--active' : ''}`}
                onClick={() => setActiveChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="av-notif-groups">
            {PRICE_ALERTS.map(group => (
              <div key={group.group} className="av-notif-group">
                <span className="av-group-label">{group.group}</span>
                {group.items.map(item => (
                  <NotifCard key={item.id} item={item} menuType="price" onClick={() => setSelectedItem(item)} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialAlertsView({ onBack }) {
  const [selectedItem, setSelectedItem] = useState(null)

  if (selectedItem) {
    return <SocialAlertDetailView item={selectedItem} onBack={() => setSelectedItem(null)} />
  }

  return (
    <div className="av-shell">
      <div className="av-topbar av-topbar--detail">
        <button className="av-back-btn" onClick={onBack}>
          <span className="msi">arrow_left_alt</span>
        </button>
        <h1 className="av-heading">Social media</h1>
      </div>
      <div className="av-body">
        <div className="av-inner">
          <div className="av-notif-groups">
            {SOCIAL_ALERTS.map(group => (
              <div key={group.group} className="av-notif-group">
                <span className="av-group-label">{group.group}</span>
                {group.items.map(item => (
                  <NotifCard key={item.id} item={item} menuType="social" onClick={() => setSelectedItem(item)} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const INITIAL_ALERTS = [
  {
    category: 'Price Drops',
    items: [
      { label: 'BTC drops 10% in 24h', enabled: true },
      { label: 'ETH drops 10% in 24h', enabled: false },
    ],
  },
  {
    category: 'Price Increases',
    items: [
      { label: 'BTC rises 10% in 24h', enabled: false },
      { label: 'ETH rises 10% in 24h', enabled: true },
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
      { label: 'ETH drops 10% below its ATH', enabled: false },
    ],
  },
  {
    category: 'Target Price',
    items: [
      { label: 'BTC reaches $75K', enabled: false },
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
    INITIAL_ALERTS.map(cat => ({ ...cat, items: cat.items.map(i => ({ ...i })) }))
  )
  const [showModal, setShowModal] = useState(false)
  const [historyView, setHistoryView] = useState(null)

  if (historyView === 'price') return <PriceAlertsView onBack={() => setHistoryView(null)} />
  if (historyView === 'social') return <SocialAlertsView onBack={() => setHistoryView(null)} />

  const toggle = (ci, ii) => {
    setAlerts(prev => prev.map((cat, c) =>
      c === ci
        ? { ...cat, items: cat.items.map((item, i) => i === ii ? { ...item, enabled: !item.enabled } : item) }
        : cat
    ))
  }

  const allEnabled = alerts.every(cat => cat.items.every(i => i.enabled))

  const toggleAll = () => {
    const next = !allEnabled
    setAlerts(prev => prev.map(cat => ({ ...cat, items: cat.items.map(i => ({ ...i, enabled: next })) })))
  }

  return (
    <div className="av-shell">
      <div className="av-topbar">
        <h1 className="av-heading">Alerts</h1>
      </div>

      <div className="av-body">
        <div className="av-inner">
          <div className="av-tabs">
            <button className={`av-tab${tab === 'alerts' ? ' active' : ''}`} onClick={() => setTab('alerts')}>
              Alerts
            </button>
            <button className={`av-tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
              History
              <span className="av-tab-dot" />
            </button>
          </div>

          {tab === 'alerts' && (
            <div className="av-content">
              <div className="av-custom-section">
                <div className="av-action-row av-action-row--border">
                  <span className="av-section-title">Custom Alerts</span>
                  <div className="av-row-right">
                    <button className="av-accent-link" onClick={() => setShowModal(true)}>Add custom alert</button>
                    <button className="av-icon-btn av-icon-btn--brand" onClick={() => setShowModal(true)}>
                      <span className="msi">notification_add</span>
                    </button>
                  </div>
                </div>
                <p className="av-empty-text">You don't have any custom alerts yet.</p>
              </div>

              <div className="av-thick-divider" />

              <div className="av-default-section">
                <div className="av-action-row av-action-row--default">
                  <span className="av-section-title">Default Alerts</span>
                  <button className="av-accent-link" onClick={toggleAll}>{allEnabled ? 'Remove all' : 'Add all'}</button>
                </div>

                {alerts.map((cat, ci) => (
                  <div key={cat.category} className="av-category">
                    <p className="av-cat-label">{cat.category}</p>
                    <div className="av-items">
                      {cat.items.map((item, ii) => (
                        <div key={item.label} className={`av-item${ii < cat.items.length - 1 ? ' av-item--sep' : ''}`}>
                          <span className="av-item-label">{item.label}</span>
                          <button
                            className={`av-item-btn${item.enabled ? ' av-item-btn--added' : ''}`}
                            onClick={() => toggle(ci, ii)}
                          >
                            <span className="msi">{item.enabled ? 'check' : 'add'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="av-content">
              <div className="av-history-rows">
                {HISTORY_ROWS.map(row => (
                  <button
                    key={row.id}
                    className="av-history-row"
                    onClick={() => setHistoryView(row.id)}
                  >
                    <div className="av-history-row-icon">
                      <span className="msi">{row.icon}</span>
                    </div>
                    <span className="av-history-row-label">{row.label}</span>
                    <span className="av-history-row-date">{row.date}</span>
                    <span className="av-history-row-count">{row.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && <CustomAlertModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
