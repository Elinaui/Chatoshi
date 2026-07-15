import { useState, useRef, useEffect } from 'react'
import btcImg from '../assets/coins/btc.png'
import bnbImg from '../assets/coins/bnb.png'
import bonkImg from '../assets/coins/bonk.png'
import chatoshiLogo from '../assets/chatoshi-logo.svg'
import iconAI from '../assets/icon-ai.svg'
import iconTempChat from '../assets/icon-temp-chat-off.svg'
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

export default function ChatView({ state, query, responseData, onSearch, onSend, onBack }) {
  const [input, setInput]   = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (state === 'home') setInput('') }, [state])

  const displayValue = state === 'search' ? query : input

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
          <button className="cv-temp-btn" title="Temporary chat">
            <img src={iconTempChat} alt="" className="cv-icon-24" />
          </button>
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
          <ResponseView query={responseData?.query || query} onBack={onBack} />
        )}
      </div>

      {/* ── Floating input (search + response states only) ── */}
      {state !== 'home' && (
        <div className="cv-input-area">
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
      <button className="cv-mic-btn">
        <span className="msi">mic</span>
      </button>
      <button className={`cv-send-btn ${value ? 'active' : ''}`} onClick={onSend}>
        <img src={iconAI} alt="" className="cv-icon-24" />
      </button>
    </div>
  )
}

/* ── HOME VIEW ── */
function HomeView({ onQuestion, inputValue, focused, onChange, onFocus, onBlur, onKey, onSend, inputRef }) {
  const [selectedChip, setSelectedChip] = useState(0)
  const carouselRef = useRef(null)

  const handleChipClick = (idx) => {
    setSelectedChip(idx)
    // Scroll carousel back to start when category changes
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 176, behavior: 'smooth' })
    }
  }

  const questions = CHIP_QUESTIONS[selectedChip] || []

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
              onClick={() => handleChipClick(i)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Carousel with arrows */}
        <div className="home-carousel-wrap">
          <button className="carousel-arrow left" onClick={() => scrollCarousel(-1)}>
            <span className="msi">keyboard_arrow_left</span>
          </button>
          <div className="home-carousel" ref={carouselRef}>
            {questions.map((q, i) => (
              <button key={i} className="q-card" onClick={() => onQuestion(q)}>{q}</button>
            ))}
          </div>
          <button className="carousel-arrow right" onClick={() => scrollCarousel(1)}>
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

/* ── RESPONSE VIEW ── */
const CHART_Y = [80, 72, 76, 62, 66, 46, 56, 42, 52, 36, 38, 26, 22, 18]

function SparkLine() {
  const w = 280, h = 100
  const pts  = CHART_Y.map((y, i) => `${(i / (CHART_Y.length - 1)) * w},${y}`).join(' ')
  const area = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="rv-chart">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="#006347" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#006347" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sg)" />
      <polyline points={pts} fill="none" stroke="#006347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ResponseView({ query, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')
  const isBNB = /bnb|binance/i.test(query)
  const coin = isBNB
    ? { name: 'BNB', symbol: 'BNB', price: '$615.40', change: '+8.7%', pos: true,  cap: '$88.4B', vol: '$2.1B',  supply: '145.9M BNB', rank: '#4', img: bnbImg }
    : { name: 'Bitcoin', symbol: 'BTC', price: '$67,240', change: '+2.3%', pos: true, cap: '$1.32T', vol: '$32.4B', supply: '19.7M BTC',  rank: '#1', img: btcImg }

  return (
    <div className="rv-shell">
      <button className="rv-back" onClick={onBack}>
        <span className="msi rv-back-icon">arrow_back</span>
        Back
      </button>

      <div className="rv-header">
        <div className="rv-header-left">
          <div className="rv-coin-img-wrap">
            {coin.img
              ? <img src={coin.img} alt={coin.symbol} className="rv-coin-img" />
              : <span className="rv-coin-fallback">{coin.symbol[0]}</span>}
          </div>
          <div>
            <div className="rv-coin-name">
              {coin.name}
              <span className="rv-sym">{coin.symbol}</span>
            </div>
            <div className="rv-price-row">
              <span className="rv-price">{coin.price}</span>
              <span className={`rv-change ${coin.pos ? 'pos' : 'neg'}`}>
                <span className="msi rv-chg-arrow">{coin.pos ? 'arrow_upward_alt' : 'arrow_downward_alt'}</span>
                {coin.change}
              </span>
            </div>
          </div>
        </div>
        <div className="rv-chart-wrap"><SparkLine /></div>
      </div>

      <div className="rv-stats">
        {[['Market Cap', coin.cap], ['24h Volume', coin.vol], ['Circulating Supply', coin.supply], ['Rank', coin.rank]].map(([l, v]) => (
          <div key={l} className="rv-stat">
            <span className="rv-stat-label">{l}</span>
            <span className="rv-stat-val">{v}</span>
          </div>
        ))}
      </div>

      <div className="rv-tabs">
        {['overview', 'community', 'news'].map(tab => (
          <button key={tab} className={`rv-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="rv-content">
          <div className="rv-text-card">
            <p>{isBNB
              ? 'BNB (Binance Coin) is the native cryptocurrency of the Binance ecosystem. Originally launched as an ERC-20 token in 2017, BNB migrated to Binance Chain and now powers the BNB Smart Chain, enabling fast and low-cost transactions.'
              : "Bitcoin (BTC) is the world's first and largest cryptocurrency by market capitalization, created in 2009 by the pseudonymous Satoshi Nakamoto. It introduced blockchain technology and decentralized peer-to-peer digital currency."
            }</p>
          </div>
          <div className="rv-market-card">
            <div className="rv-market-title">Market Data</div>
            {[
              ['All-Time High', isBNB ? '$686.31' : '$73,835', null],
              ['All-Time Low',  isBNB ? '$0.097'  : '$67.81',  null],
              ['7d Change',     isBNB ? '+12.4%'  : '+5.8%',   true],
              ['30d Change',    isBNB ? '+28.1%'  : '-3.2%',   isBNB],
            ].map(([label, val, pos]) => (
              <div key={label} className="rv-market-row">
                <span className="rv-market-label">{label}</span>
                <span className={`rv-market-val ${pos === true ? 'pos' : pos === false ? 'neg' : ''}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="rv-content">
          <div className="rv-community-grid">
            {[['Twitter / X','alternate_email'],['Reddit','forum'],['Telegram','send'],['Discord','chat_bubble'],['GitHub','code'],['Website','language']].map(([label, icon]) => (
              <button key={label} className="rv-comm-btn">
                <span className="msi rv-comm-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="rv-content">
          <div className="rv-news-list">
            {[
              { title: `${coin.symbol} surges ${coin.change} as institutional demand rises`, source: 'CoinDesk',    time: '2h ago' },
              { title: `${coin.name} ecosystem grows with new DeFi protocol launch`,         source: 'CryptoSlate', time: '5h ago' },
              { title: `Analysts predict ${coin.symbol} could reach new ATH by Q4 2025`,    source: 'Decrypt',     time: '8h ago' },
            ].map(n => (
              <button key={n.title} className="rv-news-item">
                <div className="rv-news-body">
                  <span className="rv-news-title">{n.title}</span>
                  <span className="rv-news-meta">{n.source} · {n.time}</span>
                </div>
                <span className="msi rv-news-arr">keyboard_arrow_right</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
