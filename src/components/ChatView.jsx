import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import btcImg from '../assets/coins/btc.png'
import bnbImg from '../assets/coins/bnb.png'
import bnbIconImg from '../assets/coins/bnb-icon.png'
import bonkImg from '../assets/coins/bonk.png'
import chatoshiLogo from '../assets/chatoshi-logo.svg'
import iconAI from '../assets/icon-ai.svg'
import iconTempChat from '../assets/icon-temp-chat-off.svg'
// Exchange logos
import tronLogo from '../assets/exchanges/tron.png'
import tronscanLogo from '../assets/exchanges/tronscan.png'
import curveLogo from '../assets/exchanges/curve.png'
import binanceLogo from '../assets/exchanges/binance.png'
// Wallet logos
import metamaskLogo from '../assets/wallets/metamask.png'
import ledgerLogo from '../assets/wallets/ledger.png'
import trezorLogo from '../assets/wallets/trezor.png'
// Social button SVGs
import btnWebsite from '../assets/social/btn-website.svg'
import btnTwitter from '../assets/social/btn-twitter.svg'
import btnYoutube from '../assets/social/btn-youtube.svg'
import btnPatreon from '../assets/social/btn-patreon.svg'
// Thoughts icon
import iconFlare from '../assets/icon-flare.svg'
import './ChatView.css'

// Chip labels exactly from Figma
const CHIPS = [
  'News & Sentiment',
  'Crypto Fundamentals',
  'X & Socials',
  'Token Information',
  'Blockchain Explorer',
  'Quant & Alpha',
  'Analytics & Insights',
]

// Questions per chip category
const CHIP_QUESTIONS = {
  0: [ // News & Sentiment
    'What is the latest crypto news today?',
    'What\'s the current market sentiment for Bitcoin?',
    'Which coins are trending right now?',
    'What\'s driving the current crypto market movement?',
    'Are there any major protocol upgrades coming?',
    'What\'s the latest regulatory news in crypto?',
    'Which altcoins are getting the most buzz this week?',
    'What are the top DeFi stories right now?',
  ],
  1: [ // Crypto Fundamentals
    'Explain the double-spending problem and its solution.',
    'What is proof of work vs proof of stake?',
    'How does a blockchain consensus mechanism work?',
    'What is a smart contract and how does it work?',
    'What is the difference between Layer 1 and Layer 2?',
    'How does DeFi differ from traditional finance?',
    'What is tokenomics and why does it matter?',
    'Explain liquidity pools and impermanent loss.',
  ],
  2: [ // X & Socials
    'Who are the most influential crypto voices on X?',
    'What is the X community saying about Ethereum?',
    'What are the social links for Bitcoin?',
    'What are the social links for XRP?',
    'Which crypto projects have the most active communities?',
    'Which influencers are bullish on altcoins right now?',
    'What is the Reddit community saying about Solana?',
    'What is the Discord for the top NFT projects?',
  ],
  3: [ // Token Information
    'What is Pepe and what is its use case?',
    'What is the total supply of Bitcoin?',
    'What is the market cap of Ethereum?',
    'Who are the founders of Solana?',
    'What is the utility of the BNB token?',
    'What are the tokenomics of Cardano?',
    'What is the circulating supply of XRP?',
    'What is the vesting schedule for Sui tokens?',
  ],
  4: [ // Blockchain Explorer
    'What are the largest Bitcoin transactions today?',
    'How many active wallets does Ethereum have?',
    'What is the current gas price on Ethereum?',
    'Show me the top whale movements for BTC.',
    'What is the total value locked in DeFi?',
    'How many transactions per second does Solana process?',
    'What is the hash rate of Bitcoin right now?',
    'What are the latest blocks on the Bitcoin chain?',
  ],
  5: [ // Quant & Alpha
    'What is the RSI for Bitcoin right now?',
    'Which coins are showing bullish divergence?',
    'What are the top volume movers in the last 24h?',
    'Which DeFi protocols have the highest APY?',
    'What are the on-chain signals for a BTC rally?',
    'Which altcoins have the best risk/reward ratio?',
    'What is the funding rate for BTC perpetuals?',
    'What is the Sharpe ratio of ETH vs BTC?',
  ],
  6: [ // Analytics & Insights
    'What is the Bitcoin dominance right now?',
    'How has ETH performed vs BTC this quarter?',
    'What is the fear and greed index today?',
    'Which sector of crypto is outperforming?',
    'What are the most correlated assets to Bitcoin?',
    'How does the current cycle compare to 2021?',
    'Which chain has the most developer activity?',
    'What are the key metrics for evaluating a DeFi protocol?',
  ],
}

const ALL_COINS = [
  { symbol: 'BTC', name: 'Bitcoin',   price: '$67,240',    change: '+2.3', pos: true,  img: btcImg  },
  { symbol: 'BNB', name: 'BNB',       price: '$310',       change: '-1.2', pos: false, img: bnbImg  },
  { symbol: 'BONK',name: 'BONK',      price: '$0.000021',  change: '+8.1', pos: true,  img: bonkImg },
  { symbol: 'ETH', name: 'Ethereum',  price: '$3,210',     change: '-0.8', pos: false, img: null    },
  { symbol: 'SOL', name: 'Solana',    price: '$178',       change: '+4.1', pos: true,  img: null    },
  { symbol: 'XRP', name: 'XRP',       price: '$0.62',      change: '+0.7', pos: true,  img: null    },
  { symbol: 'ADA', name: 'Cardano',   price: '$0.52',      change: '-1.5', pos: false, img: null    },
  { symbol: 'AVAX',name: 'Avalanche', price: '$41',        change: '+3.2', pos: true,  img: null    },
  { symbol: 'DOGE',name: 'Dogecoin',  price: '$0.18',      change: '+1.5', pos: true,  img: null    },
]

const ALL_PEOPLE = [
  { name: 'Brian Armstrong',   sub: 'CEO & Co-founder of Coinbase', initials: 'BA' },
  { name: 'Ben Armstrong',     sub: 'Known as BitBoy Crypto',       initials: 'BA' },
  { name: 'Balaji Srinivasan', sub: 'Former CTO of Coinbase',       initials: 'BS' },
  { name: 'Vitalik Buterin',   sub: 'Co-founder of Ethereum',       initials: 'VB' },
]

const LISTS = [
  { name: 'Bullish Memes',   desc: 'Top performing meme coins this week • 15 coins' },
  { name: 'Blue Chip Coins', desc: 'Established cryptocurrencies with high market cap • 8 coins' },
]

function filterCoins(q) {
  if (!q) return ALL_COINS.slice(0, 3)
  const lq = q.toLowerCase()
  return ALL_COINS.filter(c =>
    c.symbol.toLowerCase().startsWith(lq) || c.name.toLowerCase().startsWith(lq)
  ).slice(0, 4)
}

function filterPeople(q) {
  if (!q) return ALL_PEOPLE.slice(0, 3)
  const lq = q.toLowerCase()
  return ALL_PEOPLE.filter(p => p.name.toLowerCase().startsWith(lq)).slice(0, 3)
}

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

function TopbarMenu() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  useClickOutside(menuRef, () => setOpen(false))

  const toggle = () => {
    if (!open) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen(o => !o)
  }

  return (
    <>
      <button ref={btnRef} className="cv-dots-btn" title="More options" onClick={toggle}>
        <span className="msi">more_horiz</span>
      </button>
      {open && createPortal(
        <div ref={menuRef} className="cv-dots-menu" style={{ top: pos.top, right: pos.right }}>
          <button className="cv-dots-item" onClick={() => setOpen(false)}>
            <span className="msi cv-dots-icon">ios_share</span>
            Share thread (read-only)
          </button>
          <div className="cv-dots-divider" />
          <button className="cv-dots-item" onClick={() => setOpen(false)}>
            <span className="msi cv-dots-icon">edit</span>
            Rename chat
          </button>
          <div className="cv-dots-divider" />
          <button className="cv-dots-item cv-dots-item--danger" onClick={() => setOpen(false)}>
            <span className="msi cv-dots-icon">delete</span>
            Delete chat
          </button>
        </div>,
        document.body
      )}
    </>
  )
}

export default function ChatView({ state, query, responseData, onSearch, onSend, onBack }) {
  const [input, setInput]   = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (state === 'home') setInput('') }, [state])

  const displayValue = state === 'search' ? query : state === 'response' ? '' : input

  const handleChange = (e) => {
    const val = e.target.value
    setInput(val)
    if (val.trim()) onSearch(val)
    else if (state === 'search') onBack()
  }

  const handleSend = () => {
    const text = input.trim() || query
    if (text) onSend(text)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="cv-shell">

      {/* ── Top bar: transparent, Serious mode + temp-chat button ── */}
      <div className="cv-topbar">
        <div className="cv-topbar-left" />

        <button className="cv-mode-btn">
          <img src={chatoshiLogo} alt="" className="cv-mode-logo" />
          <span className="cv-mode-label">Serious</span>
          <span className="msi cv-mode-chevron">keyboard_arrow_down</span>
        </button>

        <div className="cv-topbar-right">
          {state === 'response'
            ? <TopbarMenu />
            : (
              <button className="cv-temp-btn" title="Temporary chat">
                <img src={iconTempChat} alt="" className="cv-icon-24" />
              </button>
            )
          }
        </div>
      </div>

      {/* ── Body ── */}
      <div className="cv-body">
        {state === 'home' && (
          <HomeView
            onQuestion={(q) => { setInput(q); onSend(q) }}
            inputValue={input}
            focused={focused}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKey={handleKey}
            onSend={handleSend}
            inputRef={inputRef}
          />
        )}
        {state === 'search' && (
          <SearchView
            query={query}
            onCoin={(coin)  => onSend(`Tell me about ${coin.name} (${coin.symbol})`)}
            onPerson={(p)   => onSend(`Tell me about ${p.name}`)}
            onList={(l)     => onSend(`Show me the ${l.name} list`)}
          />
        )}
        {state === 'response' && (
          <ResponseView onBack={onBack} />
        )}
      </div>

      {/* ── Floating input (search + response states only) ── */}
      {state !== 'home' && (
        <div className={`cv-input-area${state === 'response' ? ' cv-input-area--response' : ''}`}>
          <PromptInput
            value={displayValue}
            focused={focused}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKey={handleKey}
            onSend={handleSend}
            inputRef={inputRef}
          />
        </div>
      )}
    </div>
  )
}

/* ── Shared prompt input ── */
function PromptInput({ value, focused, onChange, onFocus, onBlur, onKey, onSend, inputRef }) {
  return (
    <div className={`cv-prompt ${focused ? 'focused' : ''}`}>
      <input
        ref={inputRef}
        className="cv-input"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKey}
        placeholder="Ask anything about crypto"
      />
      {!value && (
        <button className="cv-mic-btn">
          <span className="msi">mic</span>
        </button>
      )}
      <button className={`cv-send-btn ${value ? 'active' : ''}`} onClick={onSend}>
        {value
          ? <span className="msi cv-send-icon">send</span>
          : <img src={iconAI} alt="" className="cv-icon-24" />}
      </button>
    </div>
  )
}

const CAROUSEL_GAP = 8
const CAROUSEL_ARROW_SPACE = 48  // 40px button + 8px gap each side
const CARD_MIN_W = 160
const CARD_MAX_COUNT = 4

function useCarouselLayout(trackOuterRef) {
  const [layout, setLayout] = useState({ count: 4, cardWidth: CARD_MIN_W })

  const recalc = useCallback(() => {
    const el = trackOuterRef.current
    if (!el || el.clientWidth === 0) return
    const w = el.clientWidth
    const fit = Math.floor((w + CAROUSEL_GAP) / (CARD_MIN_W + CAROUSEL_GAP))
    const count = Math.max(1, Math.min(CARD_MAX_COUNT, fit))
    const cardWidth = Math.floor((w - CAROUSEL_GAP * (count - 1)) / count)
    setLayout({ count, cardWidth })
  }, [trackOuterRef])

  useEffect(() => {
    recalc()
    const ro = new ResizeObserver(recalc)
    if (trackOuterRef.current) ro.observe(trackOuterRef.current)
    return () => ro.disconnect()
  }, [recalc, trackOuterRef])

  return layout
}

/* ── HOME VIEW ── */
function HomeView({ onQuestion, inputValue, focused, onChange, onFocus, onBlur, onKey, onSend, inputRef }) {
  const [selectedChip, setSelectedChip] = useState(0)
  const [page, setPage] = useState(0)
  const trackOuterRef = useRef(null)
  const layout = useCarouselLayout(trackOuterRef)

  const questions = CHIP_QUESTIONS[selectedChip] || []
  const totalPages = layout.count > 0 ? Math.ceil(questions.length / layout.count) : 1
  const safePage = Math.min(page, Math.max(0, totalPages - 1))

  // Reset to first page on chip or layout count change
  useEffect(() => { setPage(0) }, [selectedChip, layout.count])

  const offset = safePage * layout.count * (layout.cardWidth + CAROUSEL_GAP)

  return (
    <div className="home-view">
      <div className="home-center">
        {/* Title — Onest SemiBold 28px */}
        <p className="home-title">Which part of crypto should we dig into?</p>

        {/* Chips — only selected has fill, rest outlined */}
        <div className="home-chips">
          {CHIPS.map((c, i) => (
            <button
              key={c}
              className={`chip-btn ${selectedChip === i ? 'selected' : ''}`}
              onClick={() => setSelectedChip(i)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Carousel with arrows */}
        <div className="home-carousel-wrap">
          <button
            className="carousel-arrow left"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={safePage === 0}
          >
            <span className="msi">keyboard_arrow_left</span>
          </button>
          <div className="home-carousel-track-outer" ref={trackOuterRef}>
            <div
              className="home-carousel-track"
              style={{ transform: `translateX(-${offset}px)` }}
            >
              {questions.map((q, i) => (
                <button
                  key={i}
                  className="q-card"
                  style={{ width: layout.cardWidth }}
                  onClick={() => onQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <button
            className="carousel-arrow right"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
          >
            <span className="msi">keyboard_arrow_right</span>
          </button>
        </div>

        {/* Input centered with the content */}
        <div className="home-input-wrap">
          <PromptInput
            value={inputValue}
            focused={focused}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKey={onKey}
            onSend={onSend}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  )
}

/* ── SEARCH VIEW ── */
function SearchView({ query, onCoin, onPerson, onList }) {
  const coins  = filterCoins(query)
  const people = filterPeople(query)

  return (
    <div className="search-view">
      {coins.length > 0 && (
        <section className="sv-section">
          <div className="sv-section-hdr">
            <span className="sv-title">Coins</span>
            <button className="sv-show-more">Show more</button>
          </div>
          <div className="sv-card">
            {coins.map((coin, i) => (
              <div key={coin.symbol}>
                {i > 0 && <div className="sv-divider" />}
                <button className="sv-row" onClick={() => onCoin(coin)}>
                  <div className="sv-coin-wrap">
                    {coin.img
                      ? <img src={coin.img} alt={coin.symbol} className="sv-coin-img" />
                      : <span className="sv-coin-letter">{coin.symbol[0]}</span>}
                  </div>
                  <div className="sv-info">
                    <span className="sv-primary">{coin.symbol}</span>
                    <span className="sv-secondary">{coin.name} • {coin.price}</span>
                  </div>
                  <div className={`sv-stat ${coin.pos ? 'pos' : 'neg'}`}>
                    <span className="msi sv-arrow">{coin.pos ? 'arrow_upward_alt' : 'arrow_downward_alt'}</span>
                    <span className="sv-pct">{coin.change}%</span>
                  </div>
                  <span className="msi sv-arr-right">keyboard_arrow_right</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {people.length > 0 && (
        <section className="sv-section">
          <div className="sv-section-hdr">
            <span className="sv-title">Influencers</span>
            <button className="sv-show-more">Show more</button>
          </div>
          <div className="sv-card">
            {people.map((p, i) => (
              <div key={p.name}>
                {i > 0 && <div className="sv-divider" />}
                <button className="sv-row" onClick={() => onPerson(p)}>
                  <div className="sv-person-av">{p.initials}</div>
                  <div className="sv-info">
                    <span className="sv-primary">{p.name}</span>
                    <span className="sv-secondary">{p.sub}</span>
                  </div>
                  <span className="msi sv-arr-right">keyboard_arrow_right</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="sv-section">
        <div className="sv-section-hdr">
          <span className="sv-title">Curated Lists</span>
        </div>
        <div className="sv-card">
          {LISTS.map((l, i) => (
            <div key={l.name}>
              {i > 0 && <div className="sv-divider" />}
              <button className="sv-row" onClick={() => onList(l)}>
                <div className="sv-list-icon"><span className="msi">format_list_bulleted</span></div>
                <div className="sv-info">
                  <span className="sv-primary">{l.name}</span>
                  <span className="sv-secondary">{l.desc}</span>
                </div>
                <span className="msi sv-arr-right">keyboard_arrow_right</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ── COMMUNITY TAB ── */
const COMM_FILTERS = ['Newest videos', 'Most popular', 'Most viewed', 'Chip']

const COMMUNITY_VIDEOS = [
  { title: "Here's your Cue to subscribe your BNB in Binance.", creator: 'Emmanuel Obuobi Fianko', tags: ['00:30 BNB','03:55 Bitcoin','12:45 Solana','22:45 BNB'], platform: 'Instagram', time: '6 hours ago',   bg: '#18181b' },
  { title: 'Will the Binance Smart Chain crash now? BNB Crypto token analysis', creator: 'Gerhard - Bitcoin Strategy', tags: ['00:30 BNB','03:55 Bitcoin','12:45 Solana','22:45 BNB'], platform: 'Youtube', time: '2 days ago',    bg: '#2d1b69' },
  { title: 'Stake BNB Now: Earn GUNZ Early Before the March 31 Binance Listing!', creator: 'Mumo', tags: ['00:30 BNB','03:55 Bitcoin','12:45 Solana','22:45 BNB'], platform: 'Youtube',    time: 'Jan 2, 2025',  bg: '#18181b' },
  { title: "Here's your Cue to subscribe your BNB in Binance.", creator: 'Emmanuel Obuobi Fianko', tags: ['00:30 BNB','03:55 Bitcoin','12:45 Solana','22:45 BNB'], platform: 'Instagram', time: '6 hours ago',   bg: '#1c1c3a' },
  { title: 'Will the Binance Smart Chain crash now? BNB Crypto token analysis', creator: 'Gerhard - Bitcoin Strategy', tags: ['00:30 BNB','03:55 Bitcoin','12:45 Solana','22:45 BNB'], platform: 'Youtube', time: '2 days ago',    bg: '#2d1b69' },
  { title: 'Stake BNB Now: Earn GUNZ Early Before the March 31 Binance Listing!', creator: 'Mumo', tags: ['00:30 BNB','03:55 Bitcoin','12:45 Solana','22:45 BNB'], platform: 'Youtube',    time: 'Jan 2, 2025',  bg: '#18181b' },
]

function CommunityContent() {
  const [activeFilter, setActiveFilter] = useState(0)
  return (
    <div className="rv-community">
      <div className="comm-filter-row">
        {COMM_FILTERS.map((f, i) => (
          <button key={f} className={`comm-chip${activeFilter === i ? ' active' : ''}`} onClick={() => setActiveFilter(i)}>
            {f}
          </button>
        ))}
      </div>
      <div className="comm-grid">
        {COMMUNITY_VIDEOS.map((v, i) => (
          <div key={i} className="comm-card">
            <div className="comm-thumb" style={{ background: v.bg }}>
              <div className="comm-play-btn">
                <span className="msi" style={{ fontSize: 24, color: '#fff' }}>play_arrow</span>
              </div>
            </div>
            <div className="comm-body">
              <p className="comm-title">{v.title}</p>
              <button className="comm-creator">
                {v.creator}
                <span className="msi" style={{ fontSize: 14 }}>chevron_right</span>
              </button>
              <div className="comm-tags">
                {v.tags.map((t, j) => (
                  <span key={j} className="comm-tag-item">
                    {j > 0 && <span className="comm-dot">•</span>}
                    {t}
                  </span>
                ))}
                <span className="comm-dot">•</span>
                <button className="comm-view-more">
                  View More <span className="msi" style={{ fontSize: 13, verticalAlign: 'middle' }}>expand_more</span>
                </button>
              </div>
              <p className="comm-footer">{v.platform} • {v.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="rv-load-more">Load more</button>
    </div>
  )
}

/* ── NEWS TAB ── */
function NewsContent() {
  return (
    <div className="rv-news">
      <div className="news-empty">
        <span className="msi news-empty-icon">search</span>
        <p className="news-empty-title">No news available</p>
        <p className="news-empty-sub">We couldn't find any recent articles or updates for this coin.</p>
      </div>
    </div>
  )
}

/* ── RESPONSE VIEW ── */
const BNB_Y = [80, 125, 168, 205, 178, 188, 152, 162, 92, 40, 108, 132, 162, 142, 172, 148, 158, 142, 132]

function BNBChart() {
  const w = 734, h = 254
  const pts = BNB_Y.map((y, i) => `${(i / (BNB_Y.length - 1)) * w},${y}`).join(' ')
  const area = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="bnb-chart-svg">
      <defs>
        <linearGradient id="bnbGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#bnbGrad)" />
      <polyline points={pts} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ResponseView({ onBack }) {
  const [activeTab, setActiveTab] = useState('summary')

  return (
    <div className="rv-shell">

      {/* User bubble */}
      <div className="rv-msg-row">
        <span className="rv-user-bubble">BNB</span>
      </div>

      {/* Thoughts pill */}
      <div className="rv-thoughts">
        <img src={iconFlare} alt="" className="rv-thoughts-icon" />
        Thought for 9s
        <span className="msi rv-thoughts-arrow">chevron_right</span>
      </div>

      {/* Graph card */}
      <div className="rv-graph-card">
        <div className="rv-coin-header">
          <div className="rv-coin-left">
            <div className="rv-coin-logo-wrap">
              <img src={bnbIconImg} alt="BNB" className="rv-coin-logo-img" />
            </div>
            <div>
              <div className="rv-coin-name-row">
                <span className="rv-coin-name">BNB</span>
                <span className="rv-coin-rank">#5</span>
              </div>
              <div className="rv-coin-subname">Binance Coin</div>
            </div>
          </div>
          <div className="rv-coin-right">
            <div className="rv-coin-price">$639,83</div>
            <div className="rv-coin-pct pos">
              <span className="msi" style={{fontSize:16}}>arrow_upward_alt</span>8.95%
            </div>
          </div>
        </div>
        <div className="rv-graph-actions">
          <div className="rv-graph-actions-left">
            <button className="rv-graph-btn"><span className="msi" style={{fontSize:18}}>bar_chart</span></button>
            <button className="rv-graph-btn"><span className="msi" style={{fontSize:18}}>ios_share</span></button>
          </div>
          <button className="rv-graph-btn"><span className="msi" style={{fontSize:18}}>fullscreen</span></button>
        </div>
        <div className="rv-chart-area">
          <BNBChart />
          <div className="rv-chart-dates">
            <span>Mar 8</span><span>Mar 15</span><span>Mar 22</span><span>Apr 8</span><span>Apr 15</span>
          </div>
        </div>
      </div>

      {/* Smart Contracts */}
      <div className="rv-section">
        <div className="rv-section-title">Smart Contracts</div>
        <div className="rv-contract-card">
          <div className="rv-contract-row">
            <div className="rv-contract-left">
              <div className="rv-contract-logo">
                <img src={tronLogo} alt="Tron" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'inherit'}} />
              </div>
              <div className="rv-contract-info">
                <span className="rv-contract-name">Tron</span>
                <div className="rv-contract-addr">
                  0xf57e7e7c....6e79ff
                  <span className="msi" style={{fontSize:14,marginLeft:4,verticalAlign:'middle',color:'var(--text-tertiary)'}}>content_copy</span>
                </div>
                <div className="rv-contract-link">
                  <img src={tronscanLogo} alt="" style={{width:16,height:16,objectFit:'contain'}} />
                  <span className="rv-tronscan">Tronscan</span>
                </div>
              </div>
            </div>
            <span className="rv-contract-badge">Primary</span>
          </div>
          <div className="rv-contract-btns">
            <button className="rv-contract-buy">Buy</button>
            <button className="rv-contract-viewall">View all Smart Contracts</button>
          </div>
        </div>
      </div>

      {/* Segmented tabs */}
      <div className="rv-seg-wrap">
        <div className="rv-seg-control">
          {['summary','community','news'].map(t => (
            <button key={t} className={`rv-seg-tab${activeTab===t?' active':''}`} onClick={()=>setActiveTab(t)}>
              {t[0].toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <p className="rv-tab-sub">
        {activeTab === 'summary'   && 'Get a quick overview of this coin and its metrics.'}
        {activeTab === 'community' && 'See what people are saying and trending in the community.'}
        {activeTab === 'news'      && "Track news that influences this coin's performance."}
      </p>

      {activeTab === 'summary' && (<>
        {/* Description */}
        <p className="rv-desc">BNB is the cryptocurrency of the Binance platform, a trading platform exclusively for cryptocurrencies. The name "Binance" is a combination of binary and finance, indicating that only cryptocurrencies can be traded against each other, not against fiat currencies. Binance Coin (BNB) is used to pay fees on Binance, including trading, transaction, and listing fees, with discounts offered for using BNB. Initially, 200 million BNBs were issued, with a portion sold during the ICO, allocated to the team, and to angel investors. Binance has a buyback plan to burn up to 100 million BNB to increase the value of the remaining coins. BNB is ranked 5th in terms of market cap, which is currently $91,897,545,708. It is traded on various exchanges, including Binance, DigiFinex, and LBank, among others.</p>

        {/* Market Data */}
        <div className="rv-section">
          <div className="rv-section-title">Market Data</div>
          <div className="rv-md-wrap">
            <div className="rv-md-ath-row">
              <div className="rv-md-cell">
                <span className="rv-md-label">All Time High</span>
                <span className="rv-md-tag">Nov 10, 2021</span>
                <span className="rv-md-val">$4878.26</span>
              </div>
              <div className="rv-md-cell">
                <span className="rv-md-label">All Time Low</span>
                <span className="rv-md-tag">Nov 10, 2021</span>
                <span className="rv-md-val">$0.43</span>
              </div>
            </div>
            <div className="rv-md-grid4">
              {[['Market Cap','$292,4B'],['Trading Vol. (24h)','$13,9B'],['Liquidity','$292,4B'],['Locked Liquidity','40%']].map(([l,v])=>(
                <div key={l} className="rv-md-cell"><span className="rv-md-label">{l}</span><span className="rv-md-val">{v}</span></div>
              ))}
            </div>
            <div className="rv-md-grid3">
              {[['Holders','24,987'],['Total Supply','120,3M'],['Circulating Supply','120,379,988']].map(([l,v])=>(
                <div key={l} className="rv-md-cell"><span className="rv-md-label">{l}</span><span className="rv-md-val">{v}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="rv-section">
          <div className="rv-section-hdr">
            <span className="rv-section-title">Categories</span>
            <button className="rv-view-all">View all (+3)</button>
          </div>
          <div className="rv-tags">
            {['Smart Contract Platform','Layer 1 (L1)','GMCI'].map(t=>(
              <span key={t} className="rv-tag">{t}</span>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="rv-section">
          <div className="rv-section-title">Social</div>
          <div className="rv-social-row">
            {[btnWebsite, btnTwitter, btnYoutube, btnPatreon].map((src,i)=>(
              <img key={i} src={src} alt="" className="rv-social-btn-svg" />
            ))}
          </div>
        </div>

        {/* Exchanges */}
        <div className="rv-section">
          <div className="rv-section-hdr">
            <span className="rv-section-title">Exchanges to Buy Ethereum</span>
            <button className="rv-view-all">View all</button>
          </div>
          <div className="rv-exchange-grid">
            {[
              {name:'CurveFinance',pairs:['ETH/USDT','BNB/ETH'], logo: curveLogo},
              {name:'Binance',     pairs:['BNB/BTC','BNB/USDT'], logo: binanceLogo},
              {name:'Binance',     pairs:['BNB/BTC','BNB/USDT'], logo: binanceLogo},
            ].map((ex,i)=>(
              <div key={i} className="rv-exchange-card">
                <div className="rv-exchange-top">
                  <div className="rv-exchange-logo"><img src={ex.logo} alt={ex.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'inherit'}} /></div>
                  <span className="rv-exchange-name">{ex.name}</span>
                </div>
                <div className="rv-exchange-pairs">
                  {ex.pairs.map(p=><span key={p} className="rv-exchange-pair">{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallets */}
        <div className="rv-section">
          <div className="rv-section-hdr">
            <span className="rv-section-title">Wallets to Buy and Store Ethereum</span>
            <button className="rv-view-all">View all</button>
          </div>
          <div className="rv-wallet-grid">
            {[
              {name:'Metamask', logo: metamaskLogo},
              {name:'Ledger',   logo: ledgerLogo},
              {name:'Trezor',   logo: trezorLogo},
            ].map(w=>(
              <div key={w.name} className="rv-wallet-card">
                <div className="rv-wallet-icon">
                  <img src={w.logo} alt={w.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'inherit'}} />
                </div>
                <span className="rv-wallet-name">{w.name}</span>
              </div>
            ))}
          </div>
        </div>
      </>)}

      {activeTab === 'community' && <CommunityContent />}
      {activeTab === 'news'      && <NewsContent />}

      {/* Chat actions */}
      <div className="rv-chat-actions">
        {['content_copy','thumb_up','thumb_down','ios_share','more_horiz'].map(icon=>(
          <button key={icon} className="rv-action-btn">
            <span className="msi rv-action-icon">{icon}</span>
          </button>
        ))}
      </div>

      <div className="rv-divider" />

      {/* Sources */}
      <div className="rv-section">
        <div className="rv-section-title">Sources</div>
        <div className="rv-sources-scroll">
          {[
            {title:'10 big air mistakes you can avoid - air..',domain:'crypto.com'},
            {title:'10 big air mistakes you can avoid - air..',domain:'cryptory.de'},
            {title:'10 big air mistakes you can avoid - air..',domain:'cryptotoast.fr'},
            {title:'10 big air mistakes you can avoid - air..',domain:'strange.love'},
            {title:'10 big air mistakes you can avoid - air..',domain:'cryptoys.com'},
          ].map((s,i)=>(
            <div key={i} className="rv-source-card">
              <p className="rv-source-title">{s.title}</p>
              <div className="rv-source-footer">
                <div className="rv-source-dot" />
                <span className="rv-source-domain">{s.domain}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rv-divider" />

      {/* Related Topics */}
      <div className="rv-section rv-section--last">
        <div className="rv-section-title">Related Topics</div>
        <div className="rv-related-list">
          {[
            "What is bitcoin's all time high?",
            "Tell me about the top 5 biggest crypto project out in the market right now",
            "Give me a market analysis on the top 5 performing coins in 2024",
            "How does blockchain work?",
          ].map(q=>(
            <button key={q} className="rv-related-item" onClick={()=>{}}>
              <span className="rv-related-text">{q}</span>
              <span className="msi rv-related-arrow">chevron_right</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
