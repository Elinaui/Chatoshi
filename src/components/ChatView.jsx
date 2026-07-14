import { useState, useRef, useEffect } from 'react'
import './ChatView.css'

const CHIPS = [
  'News & Sentiment', 'Crypto Fundamentals', 'X & Socials',
  'Trader Information', 'Blockchain Explorer', 'Guard & Alpha', 'Analytics & Insights'
]

const QUESTIONS = [
  'What is the latest crypto news?',
  'Explain the double-spending problem and its solution in cryptocurrency.',
  'What are the social links for XRP?',
  'What is Pepe?',
  'How does Ethereum staking work?',
  'What is the Bitcoin halving?',
  'Explain DeFi in simple terms.',
]

const MOCK_COINS = (query) => {
  const q = query.toLowerCase()
  const all = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$67,144', change: '+2.3', pos: true },
    { symbol: 'ETH', name: 'Ethereum', price: '$3,210', change: '-1.2', pos: false },
    { symbol: 'BNB', name: 'BNB', price: '$610', change: '+8.7', pos: true },
    { symbol: 'SOL', name: 'Solana', price: '$178', change: '+4.1', pos: true },
    { symbol: 'ADA', name: 'Cardano', price: '$0.52', change: '-0.8', pos: false },
    { symbol: 'AVAX', name: 'Avalanche', price: '$41', change: '+3.2', pos: true },
    { symbol: 'DOT', name: 'Polkadot', price: '$8.90', change: '-2.1', pos: false },
    { symbol: 'DOGE', name: 'Dogecoin', price: '$0.18', change: '+1.5', pos: true },
    { symbol: 'XRP', name: 'XRP', price: '$0.62', change: '+0.7', pos: true },
  ]
  if (!q) return all.slice(0, 3)
  return all.filter(c => c.symbol.toLowerCase().startsWith(q) || c.name.toLowerCase().startsWith(q)).slice(0, 4)
}

const MOCK_INFLUENCERS = (q) => {
  const all = [
    { name: 'Brian Armstrong', sub: 'CEO & Co-founder of Coinbase', initials: 'BA' },
    { name: 'Ben Armstrong', sub: 'Known as BitBoy Crypto', initials: 'BA' },
    { name: 'Balaji Srinivasan', sub: 'Former CTO of Coinbase', initials: 'BS' },
    { name: 'Vitalik Buterin', sub: 'Co-founder of Ethereum', initials: 'VB' },
    { name: 'CZ Binance', sub: 'Founder of Binance', initials: 'CZ' },
  ]
  if (!q) return all.slice(0, 3)
  return all.filter(p => p.name.toLowerCase().startsWith(q.toLowerCase())).slice(0, 3)
}

const MOCK_LISTS = [
  { name: 'Bullish Memes', desc: 'Top performing meme coins this week • 15 coins' },
  { name: 'Blue Chip Coins', desc: 'Established cryptocurrencies with high market cap • 8 coins' },
]

export default function ChatView({ state, query, responseData, onSearch, onSend, onBack }) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (state === 'home') setInput('')
  }, [state])

  const handleInputChange = (e) => {
    const val = e.target.value
    setInput(val)
    if (val.trim()) {
      onSearch(val)
    }
  }

  const handleSend = () => {
    const text = input.trim() || query
    if (text) onSend(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChipClick = (chip) => {
    setInput(chip)
    onSend(chip)
  }

  const handleQuestionClick = (q) => {
    setInput(q)
    onSend(q)
  }

  const handleCoinClick = (coin) => {
    onSend(`Tell me about ${coin.name} (${coin.symbol})`)
  }

  return (
    <div className="chat-view">
      <div className="chat-topbar">
        <div className="mode-selector">
          <SentimentIcon />
          <span>Sentient</span>
          <ChevronDownIcon />
        </div>
        <div className="topbar-right">
          <button className="icon-btn" title="Settings"><SettingsIcon /></button>
        </div>
      </div>

      <div className="chat-body">
        {state === 'home' && (
          <HomeState
            onChipClick={handleChipClick}
            onQuestionClick={handleQuestionClick}
          />
        )}
        {state === 'search' && (
          <SearchState
            query={query}
            onCoinClick={handleCoinClick}
            onInfluencerClick={(name) => onSend(`Tell me about ${name}`)}
            onListClick={(name) => onSend(`Show me the ${name} list`)}
          />
        )}
        {state === 'response' && (
          <ResponseState
            query={responseData?.query || query}
            onBack={onBack}
          />
        )}
      </div>

      <div className="chat-input-wrap">
        <div className={`chat-input-box ${focused ? 'focused' : ''}`}>
          <input
            ref={inputRef}
            value={state === 'search' ? query : input}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about crypto"
            className="chat-input"
          />
          <button
            className={`send-btn ${(input.trim() || query) ? 'active' : ''}`}
            onClick={handleSend}
            title="Send"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function HomeState({ onChipClick, onQuestionClick }) {
  return (
    <div className="home-state">
      <div className="home-center">
        <h1 className="home-title">Which part of crypto should we dig into?</h1>
        <div className="chips-wrap">
          {CHIPS.map(chip => (
            <button key={chip} className="chip" onClick={() => onChipClick(chip)}>{chip}</button>
          ))}
        </div>
        <div className="questions-carousel">
          {QUESTIONS.map((q, i) => (
            <button key={i} className="question-card" onClick={() => onQuestionClick(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchState({ query, onCoinClick, onInfluencerClick, onListClick }) {
  const coins = MOCK_COINS(query)
  const influencers = MOCK_INFLUENCERS(query)

  return (
    <div className="search-state">
      {coins.length > 0 && (
        <section className="result-section">
          <div className="section-header">
            <span className="section-title">Coins</span>
            <button className="show-more">Show more</button>
          </div>
          {coins.map(coin => (
            <button key={coin.symbol} className="result-row coin-row" onClick={() => onCoinClick(coin)}>
              <div className="coin-icon">{coin.symbol[0]}</div>
              <div className="coin-info">
                <span className="coin-symbol">{coin.symbol}</span>
                <span className="coin-sub">{coin.name} • ${coin.price.replace('$', '')}</span>
              </div>
              <span className={`coin-change ${coin.pos ? 'pos' : 'neg'}`}>
                {coin.change}%
                {coin.pos ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </span>
            </button>
          ))}
        </section>
      )}

      {influencers.length > 0 && (
        <section className="result-section">
          <div className="section-header">
            <span className="section-title">Influencers</span>
            <button className="show-more">Show more</button>
          </div>
          {influencers.map(p => (
            <button key={p.name} className="result-row person-row" onClick={() => onInfluencerClick(p.name)}>
              <div className="person-avatar">{p.initials}</div>
              <div className="person-info">
                <span className="person-name">{p.name}</span>
                <span className="person-sub">{p.sub}</span>
              </div>
              <ChevronRightIcon />
            </button>
          ))}
        </section>
      )}

      <section className="result-section">
        <div className="section-header">
          <span className="section-title">Curated Lists</span>
        </div>
        {MOCK_LISTS.map(list => (
          <button key={list.name} className="result-row list-row" onClick={() => onListClick(list.name)}>
            <div className="list-info">
              <span className="list-name">{list.name}</span>
              <span className="list-desc">{list.desc}</span>
            </div>
            <ChevronRightIcon />
          </button>
        ))}
      </section>
    </div>
  )
}

const CHART_POINTS = [
  { x: 0, y: 80 }, { x: 8, y: 70 }, { x: 16, y: 75 }, { x: 24, y: 60 },
  { x: 32, y: 65 }, { x: 40, y: 45 }, { x: 48, y: 55 }, { x: 56, y: 40 },
  { x: 64, y: 50 }, { x: 72, y: 35 }, { x: 80, y: 38 }, { x: 88, y: 25 },
  { x: 96, y: 20 }, { x: 100, y: 18 },
]

function MiniChart() {
  const points = CHART_POINTS.map(p => `${p.x * 2.8},${p.y}`).join(' ')
  const areaPoints = `0,100 ${points} 280,100`
  return (
    <svg className="mini-chart" viewBox="0 0 280 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#chartGrad)" />
      <polyline points={points} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ResponseState({ query, onBack }) {
  const isBNB = query.toLowerCase().includes('bnb') || query.toLowerCase().includes('binance')
  const coin = {
    name: isBNB ? 'BNB' : 'Bitcoin',
    symbol: isBNB ? 'BNB' : 'BTC',
    price: isBNB ? '$615.40' : '$67,144',
    change: isBNB ? '+8.7%' : '+2.3%',
    pos: true,
    marketCap: isBNB ? '$88.4B' : '$1.32T',
    volume: isBNB ? '$2.1B' : '$32.4B',
    supply: isBNB ? '145.9M BNB' : '19.7M BTC',
    rank: isBNB ? '#4' : '#1',
  }

  return (
    <div className="response-state">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeftIcon /> Back
      </button>

      <div className="response-coin-header">
        <div className="coin-header-left">
          <div className="coin-icon-lg">{coin.symbol[0]}</div>
          <div>
            <h2 className="coin-name-lg">{coin.name} <span className="coin-sym-badge">{coin.symbol}</span></h2>
            <div className="coin-price-row">
              <span className="coin-price-lg">{coin.price}</span>
              <span className={`coin-chg-lg ${coin.pos ? 'pos' : 'neg'}`}>{coin.change}</span>
            </div>
          </div>
        </div>
        <div className="chart-wrap">
          <MiniChart />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-label">Market Cap</span><span className="stat-val">{coin.marketCap}</span></div>
        <div className="stat-card"><span className="stat-label">24h Volume</span><span className="stat-val">{coin.volume}</span></div>
        <div className="stat-card"><span className="stat-label">Circulating Supply</span><span className="stat-val">{coin.supply}</span></div>
        <div className="stat-card"><span className="stat-label">Rank</span><span className="stat-val">{coin.rank}</span></div>
      </div>

      <div className="response-tabs">
        <button className="resp-tab active">Overview</button>
        <button className="resp-tab">Community</button>
        <button className="resp-tab">News</button>
      </div>

      <div className="response-content">
        <div className="response-text">
          <p>{isBNB
            ? 'BNB (Binance Coin) is the native cryptocurrency of the Binance ecosystem, one of the largest cryptocurrency exchanges by trading volume. Originally launched as an ERC-20 token on Ethereum in 2017, BNB later migrated to Binance Chain and now powers the BNB Smart Chain (BSC).'
            : `Bitcoin (BTC) is the world's first and largest cryptocurrency by market capitalization. Created in 2009 by the pseudonymous Satoshi Nakamoto, Bitcoin introduced blockchain technology and decentralized digital currency to the world.`
          }</p>
          <p style={{ marginTop: 10 }}>{isBNB
            ? 'BNB is used to pay transaction fees on the Binance exchange at a discount, participate in token sales on Binance Launchpad, pay for gas on BNB Smart Chain, and many other utilities within the Binance ecosystem.'
            : 'Bitcoin operates on a proof-of-work consensus mechanism, where miners compete to solve complex mathematical problems to validate transactions and earn newly minted BTC as rewards.'
          }</p>
        </div>

        <div className="response-section-title">Market Data</div>
        <div className="market-data-grid">
          <div className="md-row"><span>All-Time High</span><span className="md-val">{isBNB ? '$686.31' : '$73,835'}</span></div>
          <div className="md-row"><span>All-Time Low</span><span className="md-val">{isBNB ? '$0.097' : '$67.81'}</span></div>
          <div className="md-row"><span>7d Change</span><span className={`md-val pos`}>{isBNB ? '+12.4%' : '+5.8%'}</span></div>
          <div className="md-row"><span>30d Change</span><span className={`md-val ${isBNB ? 'pos' : 'neg'}`}>{isBNB ? '+28.1%' : '-3.2%'}</span></div>
        </div>

        <div className="response-section-title">Community</div>
        <div className="community-links">
          {[
            { label: 'Twitter / X', icon: '𝕏', url: '#' },
            { label: 'Reddit', icon: 'R', url: '#' },
            { label: 'Telegram', icon: 'T', url: '#' },
            { label: 'Discord', icon: 'D', url: '#' },
          ].map(link => (
            <a key={link.label} href={link.url} className="community-link" target="_blank" rel="noreferrer">
              <span className="comm-icon">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </div>

        <div className="response-section-title">Latest News</div>
        <div className="news-list">
          {[
            {
              title: `${coin.symbol} surges ${coin.change} as institutional demand rises`,
              source: 'CoinDesk', time: '2h ago',
            },
            {
              title: `${coin.name} ecosystem grows with new DeFi protocol launch`,
              source: 'CryptoSlate', time: '5h ago',
            },
            {
              title: `Analysts predict ${coin.symbol} could reach new ATH by Q4 2025`,
              source: 'Decrypt', time: '8h ago',
            },
          ].map(news => (
            <a key={news.title} href="#" className="news-item" onClick={e => e.preventDefault()}>
              <div className="news-body">
                <span className="news-title">{news.title}</span>
                <span className="news-meta">{news.source} · {news.time}</span>
              </div>
              <ChevronRightIcon />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// Icons
function SentimentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 9.5c.8 1 2 1.5 3 1.5s2.2-.5 3-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="6" cy="7" r="0.8" fill="currentColor" />
      <circle cx="10" cy="7" r="0.8" fill="currentColor" />
    </svg>
  )
}
function ChevronDownIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function ChevronRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function ChevronLeftIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function SettingsIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
}
function SendIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 7-14 7V10l10-1L2 8V2Z" fill="currentColor" /></svg>
}
function ArrowUpIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function ArrowDownIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M8 5l-3 3-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
