import { useEffect, useMemo, useRef, useState } from 'react'
import { App } from 'antd'
import { FiMessageCircle } from 'react-icons/fi'
import ChatHeader from './ChatHeader'
import ChatSearchBar from './ChatSearchBar'
import ChatInfo from './ChatInfo/ChatInfo'
import MessageComposer from './MessageComposer'
import MessageItem from './MessageItem'
import DateDivider from './DateDivider'
import TypingIndicator from './TypingIndicator'
import { MessagesSkeleton } from '../common/Skeleton/Skeleton'
import { messagePreviewText } from '../../utils/messages'
import './ChatWindow.css'

// group chats: show the sender name only on the first message of a run from the same person
const isFirstOfRun = (m, prev) =>
  m.direction === 'in' &&
  !!m.senderId &&
  !(prev && prev.type !== 'date' && prev.direction === 'in' && prev.senderId === m.senderId)

const searchableText = (m) => [m.text, m.type === 'file' ? m.name : ''].filter(Boolean).join(' ').toLowerCase()

const ChatWindow = ({ chat, contacts = [], messages = [], loading, onSend, onDelete, onMessageContact, onBack }) => {
  const { message, modal } = App.useApp()
  const bottomRef = useRef(null)
  const listRef = useRef(null)
  const [replyTo, setReplyTo] = useState(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [matchIndex, setMatchIndex] = useState(0)

  const q = searchOpen ? query.trim().toLowerCase() : ''
  const matches = useMemo(
    () => (q ? messages.filter((m) => m.type !== 'date' && !m.deleted && searchableText(m).includes(q)) : []),
    [messages, q],
  )
  const activeMatch = matches[Math.min(matchIndex, matches.length - 1)]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [chat?.id, messages.length])

  useEffect(() => {
    if (!activeMatch) return
    listRef.current
      ?.querySelector(`[data-msg-id="${activeMatch.id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeMatch])

  if (!chat) {
    return (
      <main className="chat-window chat-window--empty">
        <div className="chat-empty">
          <div className="chat-empty__icon">
            <FiMessageCircle />
          </div>
          <h2 className="t-h2">Select a chat</h2>
          <p className="t-sub-heading">Choose a conversation from the list to start messaging.</p>
        </div>
      </main>
    )
  }

  const groupMembers = chat.isGroup
    ? (chat.members || []).map((id) => contacts.find((c) => c.id === id)).filter(Boolean)
    : null

  const senderOf = (m) => (chat.isGroup && m.direction === 'in' ? contacts.find((c) => c.id === m.senderId) : null)

  const handleQuery = (value) => {
    setQuery(value)
    // newest result first, like most chat apps
    const next = value.trim().toLowerCase()
    const count = next
      ? messages.filter((m) => m.type !== 'date' && !m.deleted && searchableText(m).includes(next)).length
      : 0
    setMatchIndex(Math.max(count - 1, 0))
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const step = (dir) => {
    if (!matches.length) return
    setMatchIndex((i) => (Math.min(i, matches.length - 1) + dir + matches.length) % matches.length)
  }

  const handleReply = (m) => {
    const sender = senderOf(m)
    setReplyTo({
      id: m.id,
      name: m.direction === 'out' ? 'You' : sender?.name || chat.name,
      text: messagePreviewText(m),
    })
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      message.success('Copied to clipboard')
    } catch {
      message.error('Couldn’t copy, please try again')
    }
  }

  const handleDelete = (m, forEveryone) =>
    modal.confirm({
      title: forEveryone ? 'Delete for everyone?' : 'Delete for you?',
      content: forEveryone
        ? 'This message will be deleted for everyone in this chat.'
        : 'This message will be removed from this device only.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        onDelete(m.id, forEveryone)
        if (replyTo?.id === m.id) setReplyTo(null)
      },
    })

  const jumpTo = (id) => {
    const el = listRef.current?.querySelector(`[data-msg-id="${id}"]`)
    if (!el) return message.info('Original message is no longer available')
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.remove('msg--flash')
    void el.offsetWidth
    el.classList.add('msg--flash')
  }

  return (
    <main className="chat-window">
      <div className="chat-window__main">
        <ChatHeader
          chat={chat}
          onBack={onBack}
          onOpenInfo={() => setInfoOpen(true)}
          onToggleSearch={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
          searchOpen={searchOpen}
        />

        {searchOpen && (
          <ChatSearchBar
            query={query}
            onChange={handleQuery}
            total={matches.length}
            current={Math.min(matchIndex, matches.length - 1)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onClose={closeSearch}
          />
        )}

        <div className="chat-messages" ref={listRef}>
          {loading && <MessagesSkeleton />}
          {!loading &&
            messages.map((m, i) => {
              if (m.type === 'date') return <DateDivider key={m.id} label={m.label} />
              const showSender = isFirstOfRun(m, messages[i - 1])
              return (
                <MessageItem
                  key={m.id}
                  message={m}
                  sender={showSender ? senderOf(m) : null}
                  highlight={q}
                  isActiveMatch={activeMatch?.id === m.id}
                  onReply={handleReply}
                  onCopy={handleCopy}
                  onDelete={handleDelete}
                  onJump={jumpTo}
                />
              )
            })}
          {!loading && messages.length === 0 && <p className="chat-messages__empty">No messages yet. Say hi 👋</p>}
          {!loading && chat.typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <MessageComposer
          onSend={onSend}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          members={groupMembers}
        />
      </div>

      {infoOpen && (
        <ChatInfo
          chat={chat}
          contacts={contacts}
          messages={messages}
          loading={loading}
          onClose={() => setInfoOpen(false)}
          onMessageContact={onMessageContact}
        />
      )}
    </main>
  )
}

export default ChatWindow
