import { useEffect, useRef } from 'react'
import Avatar from '../common/Avatar/Avatar'
import './ChatWindow.css'

const MentionList = ({ members, activeIndex, onSelect, onHover }) => {
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  return (
    <div className="mention-list" role="listbox" aria-label="Mention a member">
      <p className="mention-list__title">Mention a member</p>
      <div ref={listRef} className="mention-list__items">
        {members.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="option"
            aria-selected={i === activeIndex}
            className={`mention-list__item ${i === activeIndex ? 'mention-list__item--active' : ''}`}
            // mousedown so the input doesn't lose focus before we insert
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(m)
            }}
            onMouseEnter={() => onHover(i)}
          >
            <Avatar name={m.name} src={m.avatar} color={m.color} size={32} online={m.online} />
            <span className="mention-list__name truncate">{m.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MentionList
