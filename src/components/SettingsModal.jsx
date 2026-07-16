import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import checkBadge from '../assets/icons/check-badge.png'
import iconAlpha from '../assets/icon-alpha.svg'
import './SettingsModal.css'

function useScrollReveal() {
  const [scrolling, setScrolling] = useState(false)
  const timeoutRef = useRef(null)
  const onScroll = () => {
    setScrolling(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setScrolling(false), 800)
  }
  useEffect(() => () => clearTimeout(timeoutRef.current), [])
  return { className: scrolling ? ' scrolling' : '', onScroll }
}

const MODES = [
  { id: 'light', label: 'Light', icon: 'light_mode' },
  { id: 'dark', label: 'Dark', icon: 'dark_mode' },
  { id: 'system', label: 'System', icon: 'routine' },
]

const CHAT_MODES = [
  { id: 'funny', label: 'Funny', desc: 'Adds humor, clever remarks, and a playful tone to every response' },
  { id: 'serious', label: 'Serious', desc: 'Keeps things concise, practical, and straight to the point' },
  { id: 'trump', label: 'Trump', desc: 'Answers with confidence, strong opinions, and dramatic flair' },
]

const FEATURES = [
  { icon: 'all_inclusive', label: 'Unlimited prompts' },
  { icon: 'celebration', label: 'Early access to new features' },
  { icon: 'article', label: 'Full-length answers' },
  { icon: 'electric_bolt', label: 'Faster responses' },
  { icon: 'notifications', label: 'Smart alerts & signals' },
  { icon: 'download', label: 'Unlimited CSV downloads' },
  { icon: 'star', label: 'Advanced AI models' },
  { icon: 'insert_chart', label: 'Advanced AI models' },
]

const LANGUAGES = [
  { id: 'en', flag: '🇺🇸', native: 'English', english: 'English' },
  { id: 'es', flag: '🇪🇸', native: 'Español', english: 'Spanish' },
  { id: 'zh', flag: '🇨🇳', native: '中文', english: 'Chinese' },
  { id: 'ar', flag: '🇸🇦', native: 'العربية', english: 'Arabic' },
  { id: 'fr', flag: '🇫🇷', native: 'Français', english: 'French' },
  { id: 'de', flag: '🇩🇪', native: 'Deutsch', english: 'German' },
  { id: 'pt', flag: '🇧🇷', native: 'Português', english: 'Portuguese' },
  { id: 'ru', flag: '🇷🇺', native: 'Русский', english: 'Russian' },
  { id: 'hi', flag: '🇮🇳', native: 'हिन्दी', english: 'Hindi' },
  { id: 'id', flag: '🇮🇩', native: 'Bahasa Indonesia', english: 'Indonesian' },
  { id: 'fil', flag: '🇵🇭', native: 'Filipino', english: 'Filipino' },
  { id: 'tr', flag: '🇹🇷', native: 'Türkçe', english: 'Turkish' },
]

function NavItem({ icon, iconImg, label, suffix, danger, active, onClick }) {
  return (
    <button className={`stg-nav-item${danger ? ' stg-nav-item--danger' : ''}${active ? ' stg-nav-item--active' : ''}`} onClick={onClick}>
      <span className={`stg-nav-icon-bg${danger ? ' stg-nav-icon-bg--danger' : ''}${active ? ' stg-nav-icon-bg--active' : ''}`}>
        {iconImg ? <img src={iconImg} alt="" className="stg-nav-icon-img" /> : <span className="msi">{icon}</span>}
      </span>
      <span className="stg-nav-label">{label}</span>
      {suffix && <span className="stg-nav-suffix">{suffix}</span>}
      <span className="msi stg-nav-chevron">keyboard_arrow_right</span>
    </button>
  )
}

export default function SettingsModal({ onClose, initialTab = 'general' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [theme, setTheme] = useState('system')
  const [chatMode, setChatMode] = useState('funny')
  const [keyterm, setKeyterm] = useState(true)
  const [haptic, setHaptic] = useState(false)
  const [pushNotif, setPushNotif] = useState(true)
  const [alphaSignals, setAlphaSignals] = useState(false)
  const [smartSuggestions, setSmartSuggestions] = useState(false)
  const [language, setLanguage] = useState('en')
  const [languageSearch, setLanguageSearch] = useState('')
  const [feedbackType, setFeedbackType] = useState('')
  const [feedbackDetails, setFeedbackDetails] = useState('')
  const [contactName, setContactName] = useState('Aaron Armstrong')
  const [contactEmail, setContactEmail] = useState('aaronarmstrong@gmail.com')
  const [contactComments, setContactComments] = useState('')
  const navScroll = useScrollReveal()
  const panelScroll = useScrollReveal()

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="stg-overlay" onClick={onClose}>
      <div className="stg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="stg-top">
          <h2 className="stg-title">Menu</h2>
          <button className="stg-close" onClick={onClose}>
            <span className="msi">close</span>
          </button>
        </div>

        <div className="stg-content">
          <div className={`stg-nav${navScroll.className}`} onScroll={navScroll.onScroll}>
            <div className="stg-nav-card">
              <NavItem icon="tune" label="General" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
              <NavItem icon="star" label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            </div>

            <div className="stg-nav-group">
              <span className="stg-nav-group-label">Preferences</span>
              <div className="stg-nav-card">
                <NavItem icon="notifications" label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                <NavItem
                  icon="language"
                  label="Language"
                  suffix={LANGUAGES.find((l) => l.id === language)?.english}
                  active={activeTab === 'language'}
                  onClick={() => setActiveTab('language')}
                />
              </div>
            </div>

            <div className="stg-nav-group">
              <span className="stg-nav-group-label">Support &amp; Legal</span>
              <div className="stg-nav-card">
                <NavItem icon="balance" label="Legal" active={activeTab === 'legal'} onClick={() => setActiveTab('legal')} />
                <NavItem icon="feedback" label="Share your feedback" active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
                <NavItem icon="help" label="Need help? Contact us" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
              </div>
            </div>

            <div className="stg-nav-group">
              <span className="stg-nav-group-label">Account</span>
              <div className="stg-nav-card">
                <NavItem icon="logout" label="Sign out" />
                <NavItem icon="delete" label="Delete account" danger />
              </div>
            </div>

            <div className="stg-nav-footer">Chatoshi AI V1.0</div>
          </div>

          <div className={`stg-panel${panelScroll.className}`} onScroll={panelScroll.onScroll}>
          {activeTab === 'subscription' ? (
            <>
              <div className="stg-plan-card">
                <div className="stg-plan-top">
                  <div className="stg-plan-info">
                    <span className="stg-plan-label">Current Plan</span>
                    <span className="stg-plan-name">Pro</span>
                  </div>
                  <span className="stg-plan-tag"><span className="msi">check</span>Active</span>
                </div>
                <div className="stg-plan-bottom">
                  <div className="stg-plan-price">
                    <span className="stg-plan-amount">$49</span>
                    <span className="stg-plan-period">/month</span>
                  </div>
                  <div className="stg-plan-billing">
                    <span className="stg-plan-billing-label">Next billing</span>
                    <span className="stg-plan-billing-date">Feb 8, 2026</span>
                  </div>
                </div>
              </div>

              <div className="stg-section">
                <h3 className="stg-section-title">You have access to</h3>
                <div className="stg-features">
                  {FEATURES.map((f, i) => (
                    <div key={i} className="stg-feature">
                      <span className="stg-feature-icon-bg"><span className="msi">{f.icon}</span></span>
                      <span className="stg-feature-label">{f.label}</span>
                      <span className="msi stg-feature-check">check</span>
                    </div>
                  ))}
                </div>
                <button className="stg-cancel-btn">Cancel subscription</button>
              </div>
            </>
          ) : activeTab === 'notifications' ? (
            <>
              <div className="stg-notif-card stg-notif-card--highlight">
                <span className="stg-notif-icon-bg stg-notif-icon-bg--active"><span className="msi">notifications_active</span></span>
                <span className="stg-notif-label">Push notifications</span>
                <button className={`stg-toggle${pushNotif ? ' on' : ''}`} onClick={() => setPushNotif((v) => !v)}>
                  <span className="stg-toggle-knob" />
                </button>
              </div>
              <div className="stg-notif-card">
                <span className="stg-notif-icon-bg"><img src={iconAlpha} alt="" className="stg-notif-icon-img" /></span>
                <div className="stg-notif-text">
                  <span className="stg-notif-label">Alpha Signals</span>
                  <span className="stg-notif-desc">New trending coin signals</span>
                </div>
                <button className={`stg-toggle${alphaSignals ? ' on' : ''}`} onClick={() => setAlphaSignals((v) => !v)}>
                  <span className="stg-toggle-knob" />
                </button>
              </div>
              <div className="stg-notif-card">
                <span className="stg-notif-icon-bg"><span className="msi">auto_awesome</span></span>
                <div className="stg-notif-text">
                  <span className="stg-notif-label">Smart Suggestions</span>
                  <span className="stg-notif-desc">AI-powered alert tips</span>
                </div>
                <button className={`stg-toggle${smartSuggestions ? ' on' : ''}`} onClick={() => setSmartSuggestions((v) => !v)}>
                  <span className="stg-toggle-knob" />
                </button>
              </div>

              <div className="stg-section">
                <h3 className="stg-section-title">Manage</h3>
                <button className="stg-notif-card stg-notif-card--link">
                  <span className="stg-notif-icon-bg"><span className="msi">notifications</span></span>
                  <div className="stg-notif-text">
                    <span className="stg-notif-label">My Alerts</span>
                    <span className="stg-notif-desc">Custom and default alerts</span>
                  </div>
                  <span className="msi stg-nav-chevron">keyboard_arrow_right</span>
                </button>
                <button className="stg-notif-card stg-notif-card--link">
                  <span className="stg-notif-icon-bg"><span className="msi">notifications</span></span>
                  <div className="stg-notif-text">
                    <span className="stg-notif-label">Sound preferences</span>
                    <span className="stg-notif-desc">Customize sound per notification</span>
                  </div>
                  <span className="msi stg-nav-chevron">keyboard_arrow_right</span>
                </button>
              </div>
            </>
          ) : activeTab === 'language' ? (
            <>
              <div className="stg-lang-search">
                <span className="msi stg-lang-search-icon">search</span>
                <input
                  className="stg-lang-search-input"
                  placeholder="Search here"
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                />
              </div>
              <div className="stg-lang-grid">
                {LANGUAGES.filter((l) =>
                  `${l.native} ${l.english}`.toLowerCase().includes(languageSearch.toLowerCase())
                ).map((l) => (
                  <button
                    key={l.id}
                    className={`stg-lang-card${language === l.id ? ' selected' : ''}`}
                    onClick={() => setLanguage(l.id)}
                  >
                    <span className="stg-lang-flag">{l.flag}</span>
                    <div className="stg-lang-text">
                      <span className="stg-lang-native">{l.native}</span>
                      <span className="stg-lang-english">{l.english}</span>
                    </div>
                    {language === l.id && <img src={checkBadge} alt="" className="stg-check-badge" />}
                  </button>
                ))}
              </div>
            </>
          ) : activeTab === 'legal' ? (
            <>
              <button className="stg-notif-card stg-notif-card--link">
                <span className="stg-notif-icon-bg"><span className="msi">article</span></span>
                <div className="stg-notif-text">
                  <span className="stg-notif-label">Terms of Service</span>
                  <span className="stg-notif-desc">User agreement &amp; usage rights</span>
                </div>
                <span className="msi stg-nav-chevron">open_in_new</span>
              </button>
              <button className="stg-notif-card stg-notif-card--link">
                <span className="stg-notif-icon-bg"><span className="msi">encrypted</span></span>
                <div className="stg-notif-text">
                  <span className="stg-notif-label">Privacy Policy</span>
                  <span className="stg-notif-desc">How we collect &amp; use your data</span>
                </div>
                <span className="msi stg-nav-chevron">open_in_new</span>
              </button>

              <div className="stg-appinfo-card">
                <h3 className="stg-section-title">App Info</h3>
                <div className="stg-appinfo-row">
                  <span className="stg-appinfo-key">Version</span>
                  <span className="stg-appinfo-value">2.4.1 (Build 408)</span>
                </div>
                <div className="stg-appinfo-row">
                  <span className="stg-appinfo-key">Last Updated</span>
                  <span className="stg-appinfo-value">June 10, 2025</span>
                </div>
                <div className="stg-appinfo-row">
                  <span className="stg-appinfo-key">Developer</span>
                  <span className="stg-appinfo-value">CoinReport Inc.</span>
                </div>
              </div>
            </>
          ) : activeTab === 'feedback' ? (
            <>
              <div className="stg-field">
                <span className="stg-field-label">What type of feedback you have?</span>
                <div className="stg-select-wrap">
                  <select
                    className="stg-select"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select feedback type</option>
                    <option value="bug">Bug report</option>
                    <option value="feature">Feature request</option>
                    <option value="general">General feedback</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="msi stg-select-chevron">keyboard_arrow_down</span>
                </div>
              </div>

              <div className="stg-field">
                <span className="stg-field-label">Add more details</span>
                <div className="stg-textarea-wrap">
                  <textarea
                    className="stg-textarea"
                    placeholder="Write feedback details"
                    maxLength={2000}
                    value={feedbackDetails}
                    onChange={(e) => setFeedbackDetails(e.target.value)}
                  />
                  <span className="stg-textarea-count">{feedbackDetails.length}/2000 characters</span>
                </div>
              </div>

              <div className="stg-field">
                <span className="stg-field-label">Add attachments (optional)</span>
                <div className="stg-attachments">
                  <button className="stg-attach-tile"><span className="msi">add_photo_alternate</span></button>
                  <button className="stg-attach-tile"><span className="msi">add_photo_alternate</span></button>
                  <button className="stg-attach-tile"><span className="msi">add_photo_alternate</span></button>
                </div>
              </div>

              <button className="stg-submit-btn" disabled={!feedbackType || !feedbackDetails.trim()}>Submit</button>
            </>
          ) : activeTab === 'contact' ? (
            <>
              <div className="stg-field">
                <span className="stg-field-label">Full name</span>
                <input className="stg-input" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>

              <div className="stg-field">
                <span className="stg-field-label">Email address</span>
                <input className="stg-input" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>

              <div className="stg-field">
                <span className="stg-field-label">Add your comments</span>
                <div className="stg-textarea-wrap">
                  <textarea
                    className="stg-textarea"
                    placeholder="Write details"
                    maxLength={1000}
                    value={contactComments}
                    onChange={(e) => setContactComments(e.target.value)}
                  />
                  <span className="stg-textarea-count">{contactComments.length}/1000 characters</span>
                </div>
              </div>

              <div className="stg-field">
                <span className="stg-field-label">Add attachments (optional)</span>
                <div className="stg-attachments">
                  <button className="stg-attach-tile"><span className="msi">add_photo_alternate</span></button>
                  <button className="stg-attach-tile"><span className="msi">add_photo_alternate</span></button>
                  <button className="stg-attach-tile"><span className="msi">add_photo_alternate</span></button>
                </div>
              </div>

              <button className="stg-submit-btn" disabled={!contactComments.trim()}>Submit</button>
            </>
          ) : (
            <>
            <div className="stg-section">
              <h3 className="stg-section-title">Appearance</h3>
              <div className="stg-modes">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    className={`stg-mode-card stg-mode-card--${m.id}${theme === m.id ? ' selected' : ''}`}
                    onClick={() => setTheme(m.id)}
                  >
                    <div className="stg-mode-preview">
                      {m.id === 'system' && <span className="stg-mode-preview-dark" />}
                      <span className="stg-mode-line stg-mode-line--full" />
                      <span className="stg-mode-line stg-mode-line--half" />
                      <span className="stg-mode-line stg-mode-line--accent" />
                      <span className="stg-mode-line stg-mode-line--box" />
                    </div>
                    <div className="stg-mode-footer">
                      <span className="msi">{m.icon}</span>
                      <span>{m.label}</span>
                    </div>
                    {theme === m.id && (
                      <img src={checkBadge} alt="" className="stg-check-badge stg-check-badge--corner" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="stg-divider" />

            <div className="stg-section">
              <h3 className="stg-section-title">Chat Mode</h3>
              <div className="stg-chatmodes">
                {CHAT_MODES.map((m) => (
                  <button
                    key={m.id}
                    className={`stg-chatmode-card${chatMode === m.id ? ' selected' : ''}`}
                    onClick={() => setChatMode(m.id)}
                  >
                    <div className="stg-chatmode-text">
                      <span className="stg-chatmode-label">{m.label}</span>
                      <span className="stg-chatmode-desc">{m.desc}</span>
                    </div>
                    {chatMode === m.id && (
                      <img src={checkBadge} alt="" className="stg-check-badge" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="stg-divider" />

            <div className="stg-toggle-row">
              <span className="stg-toggle-icon-bg"><span className="msi">tooltip</span></span>
              <div className="stg-toggle-text">
                <span className="stg-toggle-label">Keyterm explanations</span>
                <span className="stg-toggle-desc">Highlight and define key terms in responses for better understanding.</span>
              </div>
              <button className={`stg-toggle${keyterm ? ' on' : ''}`} onClick={() => setKeyterm((k) => !k)}>
                <span className="stg-toggle-knob" />
              </button>
            </div>

            <div className="stg-toggle-row">
              <span className="stg-toggle-icon-bg"><span className="msi">vibration</span></span>
              <div className="stg-toggle-text">
                <span className="stg-toggle-label">Haptic feedback</span>
                <span className="stg-toggle-desc">Enables subtle vibrations for taps and interactions.</span>
              </div>
              <button className={`stg-toggle${haptic ? ' on' : ''}`} onClick={() => setHaptic((h) => !h)}>
                <span className="stg-toggle-knob" />
              </button>
            </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
