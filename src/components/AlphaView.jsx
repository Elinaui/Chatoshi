import { useState } from 'react'
import './AlphaView.css'

const alphaItems = [
  { id: 1, coin: '$dokkterflut', icon: '🪙', label: 'New trending coin detected', time: 'Today, 11:56 AM', isNew: true },
  { id: 2, coin: '$val', icon: '💰', label: 'New trending coin detected', time: 'Today, 11:48 AM', isNew: true },
  { id: 3, coin: '$derupt_memUp', icon: '📈', label: 'New trending coin detected', time: 'Today, 11:43 AM', isNew: true },
  { id: 4, coin: '$dokkterflut', icon: '🪙', label: 'New trending coin detected', time: 'Jun 28, 11:41 PM', isNew: false },
  { id: 5, coin: '$4boku', icon: '🌙', label: 'New trending coin detected', time: 'Jun 1, 11:41 PM', isNew: false },
  { id: 6, coin: '$dokkterflut', icon: '🪙', label: 'New trending coin detected', time: 'Jun 1, 11:41 PM', isNew: false },
  { id: 7, coin: '$ficks', icon: '⚡', label: 'New trending coin detected', time: 'Jun 1, 11:33 PM', isNew: false },
]

export default function AlphaView() {
  const [selected, setSelected] = useState(null)
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 })

  const handleRightClick = (e, item) => {
    e.preventDefault()
    setSelected(item)
    setContextPos({ x: e.clientX, y: e.clientY })
  }

  const closeContext = () => setSelected(null)

  return (
    <div className="page-view alpha-view" onClick={closeContext}>
      <div className="page-header">
        <h2>Alpha</h2>
      </div>

      <div className="alpha-content">
        <div className="alpha-list">
          {alphaItems.map(item => (
            <div
              key={item.id}
              className={`alpha-item ${item.isNew ? 'new' : ''}`}
              onContextMenu={(e) => handleRightClick(e, item)}
            >
              <div className="alpha-item-left">
                {item.isNew && <span className="alpha-dot" />}
                <span className="alpha-emoji">{item.icon}</span>
                <div className="alpha-text">
                  <span className="alpha-label">{item.label}: <strong>{item.coin}</strong></span>
                </div>
              </div>
              <span className="alpha-time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <div className="context-backdrop" onClick={closeContext} />
          <div className="context-menu" style={{ top: contextPos.y, left: contextPos.x }}>
            <button className="ctx-item">Select</button>
            <button className="ctx-item ctx-delete">Delete</button>
          </div>
        </>
      )}
    </div>
  )
}
