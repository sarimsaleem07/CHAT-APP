import { useState } from 'react'
import { EMOJI_CATEGORIES } from './emojis'
import './EmojiPicker.css'

const RECENT_KEY = 'chatapp-recent-emojis'
const RECENT_MAX = 16

const loadRecent = () => {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY))
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

const EmojiPicker = ({ onSelect }) => {
  const [recent, setRecent] = useState(loadRecent)
  const [active, setActive] = useState(recent.length ? 'recent' : EMOJI_CATEGORIES[0].key)

  const categories = recent.length
    ? [{ key: 'recent', icon: '🕘', label: 'Recently used', emojis: recent }, ...EMOJI_CATEGORIES]
    : EMOJI_CATEGORIES
  const current = categories.find((c) => c.key === active) || categories[0]

  const pick = (emoji) => {
    const next = [emoji, ...recent.filter((e) => e !== emoji)].slice(0, RECENT_MAX)
    setRecent(next)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
    onSelect(emoji)
  }

  return (
    <div className="emoji-picker">
      <div className="emoji-picker__tabs" role="tablist">
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={c.key === current.key}
            title={c.label}
            className={`emoji-picker__tab ${c.key === current.key ? 'emoji-picker__tab--active' : ''}`}
            onClick={() => setActive(c.key)}
          >
            {c.icon}
          </button>
        ))}
      </div>
      <p className="emoji-picker__label">{current.label}</p>
      <div className="emoji-picker__grid">
        {current.emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="emoji-picker__emoji"
            onClick={() => pick(emoji)}
            aria-label={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

export default EmojiPicker
