import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import logoImg from '../assets/chatoshi-light.svg'
import iconAlpha from '../assets/icon-alpha.svg'
import iconStarAlt from '../assets/icon-star-alt.svg'
import SettingsModal from './SettingsModal'
import './NavBar.css'

const INITIAL_HISTORY = [
  {
    label: 'Today',
    items: [
      { id: 1, title: 'What is bitcoins price right now?', time: '11:45 AM' },
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

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

function HistoryItem({ item, onOpenChat, isActive }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  useClickOutside(menuRef, () => setMenuOpen(false))

  const openMenu = (e) => {
    e.stopPropagation()
    const rect = btnRef.current.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    setMenuOpen(m => !m)
  }

  return (
    <div className="nb-hi-wrap">
      <button className={`nb-hi-item${isActive ? ' active' : ''}`} onClick={() => onOpenChat(item)}>
        <span className="nb-hi-title">{item.title}</span>
        <span className="nb-hi-time">{item.time}</span>
      </button>
      <div className="nb-hi-more-wrap">
        <button ref={btnRef} className="nb-hi-more-btn" onClick={openMenu}>
          <span className="msi nb-hi-more-icon">more_horiz</span>
        </button>
      </div>
      {menuOpen && createPortal(
        <div
          ref={menuRef}
          className="nb-hi-menu"
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          <button className="nb-hi-menu-item">
            <span className="msi nb-hi-menu-icon">edit</span>
            Rename
          </button>
          <div className="nb-hi-menu-divider" />
          <button className="nb-hi-menu-item nb-hi-menu-item--danger">
            <span className="msi nb-hi-menu-icon">delete</span>
            Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}

function AccountMenu({ pos, onClose, onOpenSettings }) {
  const menuRef = useRef(null)
  useClickOutside(menuRef, onClose)

  return createPortal(
    <div ref={menuRef} className="nb-acct-menu" style={{ bottom: pos.bottom, left: pos.left }}>
      <div className="nb-acct-user">
        <div className="nb-acct-user-top">
          <div className="nb-avatar">AA</div>
          <div className="nb-user-info">
            <div className="nb-user-row">
              <span className="nb-user-name">Aaron Armstrong</span>
              <span className="nb-pro-badge">
                <img src={iconStarAlt} alt="" className="nb-star-icon" />
                Pro
              </span>
            </div>
            <div className="nb-user-email">aaronarmstrong@gmail.com</div>
          </div>
        </div>
        <button className="nb-acct-portfolio-btn">Add portfolio</button>
      </div>

      <button className="nb-acct-item" onClick={() => onOpenSettings('subscription')}>
        <span className="nb-acct-icon-bg"><span className="msi">star</span></span>
        <span className="nb-acct-item-label">Subscription</span>
        <span className="msi nb-acct-chevron">keyboard_arrow_right</span>
      </button>
      <button className="nb-acct-item" onClick={() => onOpenSettings('general')}>
        <span className="nb-acct-icon-bg"><span className="msi">tune</span></span>
        <span className="nb-acct-item-label">Settings</span>
        <span className="msi nb-acct-chevron">keyboard_arrow_right</span>
      </button>
      <button className="nb-acct-item">
        <span className="nb-acct-icon-bg"><span className="msi">help</span></span>
        <span className="nb-acct-item-label">Help</span>
        <span className="msi nb-acct-chevron">keyboard_arrow_right</span>
      </button>

      <div className="nb-acct-divider" />

      <button className="nb-acct-item">
        <span className="nb-acct-icon-bg"><span className="msi">logout</span></span>
        <span className="nb-acct-item-label">Sign out</span>
        <span className="msi nb-acct-chevron">keyboard_arrow_right</span>
      </button>
    </div>,
    document.body
  )
}

export default function NavBar({ expanded, onToggle, activePage, onNavigate, activeChat, onOpenChat }) {
  const [historyGroups, setHistoryGroups] = useState(INITIAL_HISTORY)
  const [searchQ, setSearchQ] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState('general')
  const [accountMenuPos, setAccountMenuPos] = useState({ bottom: 0, left: 0 })
  const accountBtnRef = useRef(null)
  const navRef = useRef(null)
  const menuRef = useRef(null)
  useClickOutside(menuRef, () => setShowMenu(false))

  const openAccountMenu = () => {
    const navRect = navRef.current.getBoundingClientRect()
    setAccountMenuPos({ bottom: 12, left: navRect.right + 12 })
    setShowAccountMenu(m => !m)
  }

  // Prepend the active chat to the Today group when it's first set
  useEffect(() => {
    if (!activeChat) return
    setHistoryGroups(prev => {
      // Already tracked this id — just update active flag, don't duplicate
      const alreadyExists = prev.some(g => g.items.some(i => i.id === activeChat.id))
      if (alreadyExists) return prev
      const todayGroup = prev.find(g => g.label === 'Today')
      const newItem = { id: activeChat.id, title: activeChat.title, time: activeChat.time }
      if (todayGroup) {
        return prev.map(g =>
          g.label === 'Today' ? { ...g, items: [newItem, ...g.items] } : g
        )
      }
      return [{ label: 'Today', items: [newItem] }, ...prev]
    })
  }, [activeChat?.id])

  const hasHistory = historyGroups.length > 0

  const filteredGroups = historyGroups.map(g => ({
    ...g,
    items: g.items.filter(item => item.title.toLowerCase().includes(searchQ.toLowerCase())),
  })).filter(g => g.items.length > 0)

  const confirmClear = () => { setHistoryGroups([]); setShowConfirm(false) }

  return (
    <>
      <aside ref={navRef} className={`navbar ${expanded ? 'expanded' : 'collapsed'}`}>

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
          <button className="nb-item" onClick={() => onNavigate('chat')} title="New Chat">
            <span className="nb-icon-bg"><span className="msi">edit_square</span></span>
            {expanded && <span className="nb-label">New Chat</span>}
          </button>
          <button className={`nb-item ${activePage === 'alerts' ? 'active' : ''}`} onClick={() => onNavigate('alerts')} title="Alerts">
            <span className="nb-icon-bg"><span className="msi">notifications</span></span>
            {expanded && <span className="nb-label">Alerts</span>}
          </button>
          <button className={`nb-item ${activePage === 'alpha' ? 'active' : ''}`} onClick={() => onNavigate('alpha')} title="Alpha">
            <span className="nb-icon-bg"><img src={iconAlpha} alt="" className="nb-svg-icon" /></span>
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
              {hasHistory && (
                <div className="nb-more-wrap" ref={menuRef}>
                  <button className="nb-more-btn" onClick={() => setShowMenu(m => !m)}>
                    <span className="msi nb-more-icon">more_horiz</span>
                  </button>
                  {showMenu && (
                    <div className="nb-more-menu">
                      <button className="nb-more-menu-item" onClick={() => { setShowMenu(false); setShowConfirm(true) }}>
                        <span className="msi nb-more-menu-icon">delete</span>
                        Clear history
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {hasHistory && (
              <div className="nb-search">
                <span className="msi nb-search-icon">search</span>
                <input
                  className="nb-search-input"
                  placeholder="Search here"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
            )}

            <div className="nb-history-scroll">
              {filteredGroups.map(group => (
                <div key={group.label} className="nb-group">
                  <span className="nb-group-label">{group.label}</span>
                  {group.items.map(item => (
                    <HistoryItem key={item.id} item={item} onOpenChat={onOpenChat} isActive={activeChat?.active && item.id === activeChat?.id} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* History icon — collapsed */
          <>
            <button className="nb-item" title="History" onClick={onToggle}>
              <span className="nb-icon-bg"><span className="msi">history</span></span>
            </button>
            <div className="nb-history-collapsed-spacer" />
          </>
        )}

        {/* Footer */}
        <div className="nb-footer">
          <div className="nb-footer-grad" />
          {expanded ? (
            <button ref={accountBtnRef} className={`nb-user${showAccountMenu ? ' active' : ''}`} onClick={openAccountMenu}>
              <div className="nb-avatar">AA</div>
              <div className="nb-user-info">
                <div className="nb-user-row">
                  <span className="nb-user-name">Aaron Armstrong</span>
                  <span className="nb-pro-badge">
                    <img src={iconStarAlt} alt="" className="nb-star-icon" />
                    Pro
                  </span>
                </div>
                <div className="nb-user-email">aaronarmstrong@gmail.com</div>
              </div>
            </button>
          ) : (
            <button ref={accountBtnRef} className={`nb-avatar-collapsed${showAccountMenu ? ' active' : ''}`} onClick={openAccountMenu}>
              <div className="nb-avatar">AA</div>
              <span className="nb-pro-dot">
                <img src={iconStarAlt} alt="" className="nb-star-sm" />
              </span>
            </button>
          )}
        </div>
      </aside>

      {showAccountMenu && (
        <AccountMenu
          pos={accountMenuPos}
          onClose={() => setShowAccountMenu(false)}
          onOpenSettings={(tab) => { setShowAccountMenu(false); setSettingsTab(tab); setShowSettings(true) }}
        />
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} initialTab={settingsTab} />}

      {/* Clear history confirmation modal */}
      {showConfirm && (
        <div className="nb-confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="nb-confirm-dialog" onClick={e => e.stopPropagation()}>
            <button className="nb-confirm-close" onClick={() => setShowConfirm(false)}>
              <span className="msi">close</span>
            </button>
            <div className="nb-confirm-icon">
              <span className="msi nb-confirm-warn-icon">error_outline</span>
            </div>
            <p className="nb-confirm-title">Are you sure you want to clear your chat history?</p>
            <p className="nb-confirm-sub">This action cannot be undone, and the chats will be permanently deleted.</p>
            <button className="nb-confirm-yes" onClick={confirmClear}>Yes, clear all</button>
            <button className="nb-confirm-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  )
}
