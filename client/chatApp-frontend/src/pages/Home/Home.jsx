import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { App } from 'antd'
import { useAuth } from '../../context/AuthContext'
import ChatSidebar from '../../components/chat/ChatSidebar'
import ChatWindow from '../../components/chat/ChatWindow'
import { contacts, chats as initialChats, messages as initialMessages } from './dummyData'
import { ATTACHMENT_TYPES } from '../../validations/rules'
import { formatFileSize } from '../../utils/file'
import { messagePreviewText } from '../../utils/messages'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import './Home.css'

const isDesktop = () => window.matchMedia('(min-width: 768px)').matches
const nowTime = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const shortTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

const Home = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { logout } = useAuth()
  const [chats, setChats] = useState(initialChats)
  const [activeId, setActiveId] = useState(() => (isDesktop() ? initialChats[0].id : null))
  const [messages, setMessages] = useState(initialMessages)

  const activeChat = chats.find((c) => c.id === activeId)

  // TODO: replace with the chats / messages API's isLoading
  const chatsLoading = useSimulatedLoading('chats', 900)
  const messagesLoading = useSimulatedLoading(activeId, 600)

  const openChat = (id) => {
    setActiveId(id)
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0, mentioned: false } : c)))
  }

  const updatePreview = (chatId, preview) =>
    setChats((prev) => {
      const chat = prev.find((c) => c.id === chatId)
      return [{ ...chat, preview, time: shortTime() }, ...prev.filter((c) => c.id !== chatId)]
    })

  const handleSend = ({ text, attachment, preview, replyTo, mentions }) => {
    // TODO: send via API / socket (upload attachment first)
    const base = {
      id: Date.now(),
      direction: 'out',
      time: nowTime(),
      status: 'sent',
      replyTo: replyTo || undefined,
      mentions: mentions?.length ? mentions : undefined,
    }
    let msg
    if (attachment?.type.startsWith('image/')) {
      msg = { ...base, type: 'image', src: preview || URL.createObjectURL(attachment), name: attachment.name, text }
    } else if (attachment) {
      msg = {
        ...base,
        type: 'file',
        name: attachment.name,
        fileType: ATTACHMENT_TYPES[attachment.type] || 'File',
        size: formatFileSize(attachment.size),
        text,
      }
    } else {
      msg = { ...base, type: 'text', text }
    }

    setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }))
    updatePreview(activeId, `You: ${messagePreviewText(msg)}`)
  }

  const handleDelete = (messageId, forEveryone) => {
    // TODO: delete via API
    setMessages((prev) => ({
      ...prev,
      [activeId]: forEveryone
        ? prev[activeId].map((m) =>
            m.id === messageId ? { id: m.id, type: m.type, direction: m.direction, time: m.time, deleted: true } : m,
          )
        : prev[activeId].filter((m) => m.id !== messageId),
    }))
  }

  const handleStartChat = (contact) => {
    // TODO: create / fetch conversation via API
    const existing = chats.find((c) => c.contactId === contact.id)
    if (existing) return openChat(existing.id)

    const chat = {
      id: Date.now(),
      contactId: contact.id,
      name: contact.name,
      color: contact.color,
      avatar: contact.avatar,
      online: contact.online,
      preview: 'Say hi 👋',
      time: shortTime(),
    }
    setChats((prev) => [chat, ...prev])
    setMessages((prev) => ({ ...prev, [chat.id]: [] }))
    setActiveId(chat.id)
  }

  const handleCreateGroup = ({ name, members, photo }) => {
    // TODO: create group via API (upload photo)
    const chat = {
      id: Date.now(),
      name,
      isGroup: true,
      members,
      color: 'blue',
      avatar: photo ? URL.createObjectURL(photo) : undefined,
      preview: 'You created this group',
      time: shortTime(),
    }
    setChats((prev) => [chat, ...prev])
    setMessages((prev) => ({ ...prev, [chat.id]: [{ id: 1, type: 'date', label: 'Today' }] }))
    setActiveId(chat.id)
    message.success(`Group “${name}” created`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`home ${activeChat ? 'home--chat-open' : ''}`}>
      <ChatSidebar
        chats={chats}
        contacts={contacts}
        loading={chatsLoading}
        activeId={activeId}
        onSelect={openChat}
        onStartChat={handleStartChat}
        onCreateGroup={handleCreateGroup}
        onLogout={handleLogout}
      />
      <ChatWindow
        key={activeId}
        chat={activeChat}
        contacts={contacts}
        messages={messages[activeId]}
        loading={chatsLoading || messagesLoading}
        onMessageContact={handleStartChat}
        onSend={handleSend}
        onDelete={handleDelete}
        onBack={() => setActiveId(null)}
      />
    </div>
  )
}

export default Home
