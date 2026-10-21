import { Input } from 'antd'
import { FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi'
import { LIMITS } from '../../validations/rules'
import './ChatWindow.css'

const ChatSearchBar = ({ query, onChange, total, current, onPrev, onNext, onClose }) => {
  const hasQuery = query.trim().length > 0

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) onPrev()
      else onNext()
    }
  }

  return (
    <div className="chat-search">
      <Input
        variant="filled"
        prefix={<FiSearch className="chat-search__icon" />}
        placeholder="Search in this chat"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={LIMITS.searchMax}
        autoFocus
      />
      <span className="chat-search__count" aria-live="polite">
        {hasQuery ? (total ? `${current + 1} of ${total}` : 'No results') : ''}
      </span>
      <button type="button" className="icon-btn" onClick={onPrev} disabled={!total} aria-label="Previous result">
        <FiChevronUp />
      </button>
      <button type="button" className="icon-btn" onClick={onNext} disabled={!total} aria-label="Next result">
        <FiChevronDown />
      </button>
      <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
        <FiX />
      </button>
    </div>
  )
}

export default ChatSearchBar
