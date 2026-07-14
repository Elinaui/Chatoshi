import logoImg from '../assets/logo.png'
import './NavBar.css'

const historyGroups = [
  {
    label: 'Today',
    items: [
      { id: 1, title: 'What is bitcoins price right now?', time: '11:45 AM', active: true },
      { id: 2, title: 'How does blockchain work?', time: '11:20 AM' },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      { id: 3, title: 'Give me an analysis of the top 10 coins', time: 'Jul 1, 3:40 PM' },
      { id: 4, title: 'This is a random question, or is it not?', time: 'Jul 1, 3:40 PM' },
    ],
  },
  {
    label: 'This week',
    items: [
      { id: 5, title: "What's the meaning of life?", time: 'Jun 29, 12:20 AM' },
      { id: 6, title: 'How does blockchain work?', time: 'Dec 20, 2023' },
    ],
  },
]

export default function NavBar({ expanded, onToggle, activePage, onNavigate }) {
  return (
    <aside className={`navbar ${expanded ? 'expanded' : 'collapsed'}`}>

      {/* Top: logo + toggle */}
      <div className="nb-top">
        {expanded && (
          <div className="nb-logo">
            <img src={logoImg} alt="Chatoshi" className="nb-logo-img" />
          </div>
        )}
        <button className="nb-toggle" onClick={onToggle} title={expanded ? 'Collapse' : 'Expand'}>
          <span className="msi">{expanded ? 'dock_to_left' : 'dock_to_right'}</span>
        </button>
      </div>

      {/* Nav menu items */}
      <nav className="nb-menu">
        <button className={`nb-item ${activePage === 'chat' ? 'active' : ''}`} onClick={() => onNavigate('chat')} title="New Chat">
          <span className="nb-icon-bg"><span className="msi">edit_square</span></span>
          {expanded && <span className="nb-label">New Chat</span>}
        </button>
        <button className={`nb-item ${activePage === 'alerts' ? 'active' : ''}`} onClick={() => onNavigate('alerts')} title="Alerts">
          <span className="nb-icon-bg"><span className="msi">notifications</span></span>
          {expanded && <span className="nb-label">Alerts</span>}
        </button>
        <button className={`nb-item ${activePage === 'alpha' ? 'active' : ''}`} onClick={() => onNavigate('alpha')} title="Alpha">
          <span className="nb-icon-bg nb-alpha-bg"><span className="nb-alpha-glyph">α</span></span>
          {expanded && <span className="nb-label">Alpha</span>}
        </button>
        <button className={`nb-item ${activePage === 'learn' ? 'active' : ''}`} onClick={() => onNavigate('learn')} title="Learn">
          <span className="nb-icon-bg"><span className="msi">school</span></span>
          {expanded && <span className="nb-label">Learn</span>}
        </button>
      </nav>

      <div className="nb-divider" />

      {expanded ? (
        /* History panel */
        <div className="nb-history">
          <div className="nb-history-hdr">
            <span className="nb-history-title">History</span>
            <button className="nb-more-btn"><span className="msi nb-more-icon">more_horiz</span></button>
          </div>
          <div className="nb-search">
            <span className="msi nb-search-icon">search</span>
            <span className="nb-search-placeholder">Search here</span>
          </div>
          <div className="nb-history-scroll">
            {historyGroups.map(group => (
              <div key={group.label} className="nb-group">
                <span className="nb-group-label">{group.label}</span>
                {group.items.map(item => (
                  <button key={item.id} className={`nb-hi-item ${item.active ? 'active' : ''}`} onClick={() => onNavigate('chat')}>
                    <span className="nb-hi-title">{item.title}</span>
                    <span className="nb-hi-time">{item.time}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* History icon — collapsed */
        <button className="nb-item" title="History" onClick={() => onNavigate('chat')}>
          <span className="nb-icon-bg"><span className="msi">history</span></span>
        </button>
      )}

      {/* Footer */}
      <div className="nb-footer">
        <div className="nb-footer-grad" />
        {expanded ? (
          <div className="nb-user">
            <div className="nb-avatar">AA</div>
            <div className="nb-user-info">
              <div className="nb-user-row">
                <span className="nb-user-name">Aaron Armstrong</span>
                <span className="nb-pro-badge">
                  <span className="msi nb-star-icon">star</span>
                  Pro
                </span>
              </div>
              <div className="nb-user-email">aaronarmstrong@gmail.com</div>
            </div>
          </div>
        ) : (
          <div className="nb-avatar-collapsed">
            <div className="nb-avatar">AA</div>
            <span className="nb-pro-dot">
              <span className="msi nb-star-sm">star</span>
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}
