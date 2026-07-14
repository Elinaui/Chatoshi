import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import ChatView from './components/ChatView'
import AlertsView from './components/AlertsView'
import AlphaView from './components/AlphaView'
import LearnView from './components/LearnView'
import './App.css'

export default function App() {
  const [navExpanded, setNavExpanded] = useState(true)
  const [activePage, setActivePage] = useState('chat')
  const [chatState, setChatState] = useState('home')
  const [query, setQuery] = useState('')
  const [responseData, setResponseData] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('chatoshi_nav')
    if (saved !== null) setNavExpanded(saved === 'true')
  }, [])

  const toggleNav = () => {
    setNavExpanded(prev => {
      const next = !prev
      localStorage.setItem('chatoshi_nav', String(next))
      return next
    })
  }

  const navigate = (page) => {
    setActivePage(page)
    if (page === 'chat') {
      setChatState('home')
      setQuery('')
    }
  }

  const handleSearch = (text) => {
    setQuery(text)
    setActivePage('chat')
    setChatState('search')
  }

  const handleSend = (text) => {
    setQuery(text)
    setActivePage('chat')
    setChatState('response')
    setResponseData({ query: text })
  }

  const handleBack = () => {
    setChatState('home')
    setQuery('')
    setResponseData(null)
  }

  return (
    <div className={`app-shell ${navExpanded ? 'nav-expanded' : 'nav-collapsed'}`}>
      <NavBar
        expanded={navExpanded}
        onToggle={toggleNav}
        activePage={activePage}
        onNavigate={navigate}
      />
      <main className="main-content">
        {activePage === 'chat' && (
          <ChatView
            state={chatState}
            query={query}
            responseData={responseData}
            onSearch={handleSearch}
            onSend={handleSend}
            onBack={handleBack}
            navExpanded={navExpanded}
          />
        )}
        {activePage === 'alerts' && <AlertsView />}
        {activePage === 'alpha' && <AlphaView />}
        {activePage === 'learn' && <LearnView />}
      </main>
    </div>
  )
}
