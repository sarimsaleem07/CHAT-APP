import { useState } from 'react'
import { Dropdown, Input } from 'antd'
import { FiLogOut, FiMoreVertical, FiPlus, FiSearch, FiUser, FiUsers } from 'react-icons/fi'
import ChatListItem from './ChatListItem'
import ThemeToggle from '../common/ThemeToggle/ThemeToggle'
import NewChatPanel from './NewChat/NewChatPanel'
import ProfilePanel from './Profile/ProfilePanel'
import Avatar from '../common/Avatar/Avatar'
import { useAuth } from '../../context/AuthContext'
import { ChatListSkeleton } from '../common/Skeleton/Skeleton'
import { LIMITS } from '../../validations/rules'
import './ChatSidebar.css'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'groups', label: 'Groups' },
]

const ChatSidebar = ({ chats, contacts, loading, activeId, onSelect, onStartChat, onCreateGroup, onLogout }) => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [panel, setPanel] = useState(null)
  const { user } = useAuth()

  const closePanel = () => setPanel(null)

  const visibleChats = chats
    .filter((c) => (filter === 'unread' ? c.unread > 0 : filter === 'groups' ? c.isGroup : true))
    .filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()))

  const menuItems = [
    { key: 'profile', label: 'Profile & settings', icon: <FiUser />, onClick: () => setPanel('profile') },
    { key: 'group', label: 'New group', icon: <FiUsers />, onClick: () => setPanel('new-group') },
    { type: 'divider' },
    { key: 'logout', label: 'Log out', icon: <FiLogOut />, danger: true, onClick: onLogout },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <button
            type="button"
            className="sidebar__me"
            onClick={() => setPanel('profile')}
            aria-label="Open profile"
            title={user?.name}
          >
            <Avatar name={user?.name || '?'} src={user?.avatar} size={36} />
          </button>
          <h1 className="sidebar__title">Chats</h1>
        </div>
        <div className="sidebar__actions">
          <ThemeToggle />
          <button type="button" className="sidebar__new" aria-label="New chat" onClick={() => setPanel('new-chat')}>
            <FiPlus />
          </button>
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <button type="button" className="icon-btn" aria-label="More options">
              <FiMoreVertical />
            </button>
          </Dropdown>
        </div>
      </div>

      <div className="sidebar__search">
        <Input
          variant="filled"
          prefix={<FiSearch className="sidebar__search-icon" />}
          placeholder="Search or start a new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength={LIMITS.searchMax}
          allowClear
        />
      </div>

      <div className="sidebar__filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`chip ${filter === f.key ? 'chip--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="sidebar__list">
        {loading && <ChatListSkeleton />}
        {!loading &&
          visibleChats.map((chat) => (
            <ChatListItem key={chat.id} {...chat} active={chat.id === activeId} onClick={() => onSelect(chat.id)} />
          ))}
        {!loading && visibleChats.length === 0 && <p className="sidebar__empty">No chats found</p>}
      </div>

      {panel === 'profile' && <ProfilePanel onClose={closePanel} onLogout={onLogout} />}

      {(panel === 'new-chat' || panel === 'new-group') && (
        <NewChatPanel
          contacts={contacts}
          startWithGroup={panel === 'new-group'}
          onClose={closePanel}
          onStartChat={(contact) => {
            onStartChat(contact)
            closePanel()
          }}
          onCreateGroup={(group) => {
            onCreateGroup(group)
            closePanel()
          }}
        />
      )}
    </aside>
  )
}

export default ChatSidebar
