import './NavBar.css'

const history = [
  { id: 1, title: 'What is bitcoin price right now?', time: '1:25 PM', group: 'Today' },
  { id: 2, title: 'How does blockchain work?', time: '1:25 PM', group: 'Today' },
  { id: 3, title: 'Give me an analysis of the top 10...', time: '1:25 PM', group: 'Today' },
  { id: 4, title: 'This is a random question, or is it...', time: '1:25 PM', group: 'Today' },
  { id: 5, title: 'How does blockchain work?', time: 'Jul 13', group: 'Yesterday' },
  { id: 6, title: 'What is the meaning of life?', time: 'Jul 12', group: 'This week' },
  { id: 7, title: 'How does blockchain work?', time: 'Jul 11', group: 'This week' },
]

const navItems = [
  { id: 'alerts', label: 'Alerts', icon: BellIcon },
  { id: 'alpha', label: 'Alpha', icon: AlphaIcon },
  { id: 'learn', label: 'Learn', icon: GraduationIcon },
]

export default function NavBar({ expanded, onToggle, activePage, onNavigate }) {
  const historyGroups = history.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <aside className={`navbar ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="navbar-top">
        {expanded ? (
          <div className="navbar-logo">
            <LogoIcon />
            <span>Chatoshi</span>
          </div>
        ) : (
          <button className="nav-icon-btn logo-collapsed" title="Chatoshi">
            <LogoIcon />
          </button>
        )}
        <button
          className="nav-toggle-btn"
          onClick={onToggle}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? <PanelCloseIcon /> : <PanelOpenIcon />}
        </button>
      </div>

      <button
        className={`new-chat-btn ${!expanded ? 'icon-only' : ''}`}
        onClick={() => onNavigate('chat')}
        title="New Chat"
      >
        <EditIcon />
        {expanded && <span>New Chat</span>}
      </button>

      <nav className="navbar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activePage === id ? 'active' : ''} ${!expanded ? 'icon-only' : ''}`}
            onClick={() => onNavigate(id)}
            title={label}
          >
            <Icon />
            {expanded && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {expanded && (
        <div className="nav-history">
          <div className="history-search">
            <SearchSmIcon />
            <span>Search here</span>
          </div>
          {Object.entries(historyGroups).map(([group, items]) => (
            <div key={group} className="history-group">
              <div className="history-group-label">{group}</div>
              {items.map(item => (
                <button key={item.id} className="history-item" onClick={() => onNavigate('chat')}>
                  <span className="history-title">{item.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="navbar-footer">
        {expanded ? (
          <div className="user-chip">
            <div className="user-avatar">AA</div>
            <div className="user-info">
              <span className="user-name">Aaron Armstrong</span>
              <span className="user-email">aaronarmstrong@gmail.com</span>
            </div>
            <span className="plan-badge">Pro</span>
          </div>
        ) : (
          <div className="user-avatar-sm">AA</div>
        )}
      </div>
    </aside>
  )
}

function LogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="2" fill="#6C7EF7" />
      <rect x="14" y="3" width="7" height="7" rx="2" fill="#6C7EF7" opacity="0.5" />
      <rect x="3" y="14" width="7" height="7" rx="2" fill="#6C7EF7" opacity="0.5" />
      <rect x="14" y="14" width="7" height="7" rx="2" fill="#6C7EF7" opacity="0.3" />
    </svg>
  )
}

function PanelCloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6l-2 3 2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PanelOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 6l2 3-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M13 2.5L15.5 5L6 14.5H3.5V12L13 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2C6.24 2 4 4.24 4 7v5l-1.5 1.5V14h13v-.5L14 12V7c0-2.76-2.24-5-5-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.5 14c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function AlphaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <text x="1" y="14" fontFamily="serif" fontSize="16" fill="currentColor">α</text>
    </svg>
  )
}

function GraduationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3L1 7l8 4 8-4-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 9v4c0 1.1 1.79 2 4 2s4-.9 4-2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SearchSmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
