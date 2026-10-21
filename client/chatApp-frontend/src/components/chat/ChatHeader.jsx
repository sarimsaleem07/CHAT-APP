import { Dropdown } from 'antd'
import { FiArrowLeft, FiInfo, FiMoreVertical, FiPhone, FiSearch, FiVideo } from 'react-icons/fi'
import Avatar from '../common/Avatar/Avatar'
import './ChatWindow.css'

const statusText = (chat) => {
  if (chat.typing) return 'typing...'
  if (chat.isGroup) return `${(chat.members?.length ?? 0) + 1} members · tap for group info`
  return chat.online ? 'online' : 'offline'
}

const ChatHeader = ({ chat, onBack, onOpenInfo, onToggleSearch, searchOpen }) => {
  const menuItems = [
    { key: 'info', label: chat.isGroup ? 'Group info' : 'Contact info', icon: <FiInfo />, onClick: onOpenInfo },
    { key: 'search', label: 'Search', icon: <FiSearch />, onClick: onToggleSearch },
  ]

  return (
    <header className="chat-header">
      <button type="button" className="icon-btn chat-header__back" onClick={onBack} aria-label="Back to chats">
        <FiArrowLeft />
      </button>

      <button type="button" className="chat-header__profile" onClick={onOpenInfo}>
        <Avatar name={chat.name} src={chat.avatar} color={chat.color} size={44} />
        <span className="chat-header__info">
          <span className="chat-header__name truncate">{chat.name}</span>
          <span
            className={`chat-header__status truncate ${chat.online && !chat.isGroup ? 'chat-header__status--online' : ''}`}
          >
            {statusText(chat)}
          </span>
        </span>
      </button>

      <div className="chat-header__actions">
        <button type="button" className="icon-btn" aria-label="Video call" title="Coming soon">
          <FiVideo />
        </button>
        <button type="button" className="icon-btn" aria-label="Voice call" title="Coming soon">
          <FiPhone />
        </button>
        <button
          type="button"
          className={`icon-btn chat-header__optional ${searchOpen ? 'icon-btn--active' : ''}`}
          onClick={onToggleSearch}
          aria-label="Search in chat"
          aria-pressed={searchOpen}
        >
          <FiSearch />
        </button>
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <button type="button" className="icon-btn" aria-label="More options">
            <FiMoreVertical />
          </button>
        </Dropdown>
      </div>
    </header>
  )
}

export default ChatHeader
