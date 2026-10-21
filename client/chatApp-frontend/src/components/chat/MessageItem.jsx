import { useState } from 'react'
import { Dropdown } from 'antd'
import { FiChevronDown, FiCopy, FiCornerUpLeft, FiSlash, FiTrash2 } from 'react-icons/fi'
import MessageBubble, { MessageMeta } from './MessageBubble'
import FileMessage from './FileMessage'
import ImageMessage from './ImageMessage'
import './chat.css'

const ReplyQuote = ({ replyTo, onJump }) => (
  <button type="button" className="reply-quote" onClick={() => onJump(replyTo.id)}>
    <span className="reply-quote__name">{replyTo.name}</span>
    <span className="reply-quote__text">{replyTo.text}</span>
  </button>
)

const MessageItem = ({ message: m, sender, highlight, isActiveMatch, onReply, onCopy, onDelete, onJump }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isOut = m.direction === 'out'
  const quote = m.replyTo && !m.deleted ? <ReplyQuote replyTo={m.replyTo} onJump={onJump} /> : null
  const copyText = m.type === 'text' ? m.text : m.text || ''

  const items = m.deleted
    ? [{ key: 'delete-me', label: 'Delete for me', icon: <FiTrash2 />, danger: true }]
    : [
        { key: 'reply', label: 'Reply', icon: <FiCornerUpLeft /> },
        copyText && { key: 'copy', label: 'Copy', icon: <FiCopy /> },
        { type: 'divider' },
        isOut && { key: 'delete-all', label: 'Delete for everyone', icon: <FiTrash2 />, danger: true },
        { key: 'delete-me', label: 'Delete for me', icon: <FiTrash2 />, danger: true },
      ].filter(Boolean)

  const handleMenu = ({ key }) => {
    setMenuOpen(false)
    if (key === 'reply') onReply(m)
    if (key === 'copy') onCopy(copyText)
    if (key === 'delete-all') onDelete(m, true)
    if (key === 'delete-me') onDelete(m, false)
  }

  let content
  if (m.deleted) {
    content = (
      <div className={`bubble bubble--${m.direction} bubble--deleted`}>
        <p className="bubble__text">
          <FiSlash /> {isOut ? 'You deleted this message' : 'This message was deleted'}
        </p>
        <MessageMeta direction={m.direction} time={m.time} />
      </div>
    )
  } else if (m.type === 'image') {
    content = <ImageMessage {...m} caption={m.text} quote={quote} sender={sender} highlight={highlight} />
  } else if (m.type === 'file') {
    content = (
      <FileMessage {...m} type={m.fileType} caption={m.text} quote={quote} sender={sender} highlight={highlight} />
    )
  } else {
    content = (
      <MessageBubble
        direction={m.direction}
        time={m.time}
        status={m.status}
        quote={quote}
        sender={sender}
        highlight={highlight}
        mentions={m.mentions}
      >
        {m.text}
      </MessageBubble>
    )
  }

  return (
    <Dropdown
      menu={{ items, onClick: handleMenu }}
      trigger={['contextMenu']}
      open={menuOpen}
      onOpenChange={setMenuOpen}
      placement={isOut ? 'bottomRight' : 'bottomLeft'}
    >
      <div
        className={`msg msg--${m.direction} ${menuOpen ? 'msg--menu-open' : ''} ${isActiveMatch ? 'msg--match' : ''}`}
        data-msg-id={m.id}
      >
        {content}
        <button
          type="button"
          className="msg__menu-btn"
          aria-label="Message options"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((o) => !o)
          }}
        >
          <FiChevronDown />
        </button>
      </div>
    </Dropdown>
  )
}

export default MessageItem
