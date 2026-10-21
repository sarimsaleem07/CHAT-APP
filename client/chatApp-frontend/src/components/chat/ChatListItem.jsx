import Avatar from '../common/Avatar/Avatar'
import './chat.css'

const ChatListItem = ({
  name,
  color,
  avatar,
  preview,
  time,
  unread = 0,
  mentioned,
  online,
  typing,
  active,
  onClick,
}) => (
  <button type="button" className={`chat-item ${active ? 'chat-item--active' : ''}`} onClick={onClick}>
    <Avatar name={name} src={avatar} color={color} online={online} />

    <span className="chat-item__body">
      <span className="chat-item__top">
        <span className="chat-item__name truncate">{name}</span>
        <span className={`chat-item__time ${unread ? 'chat-item__time--unread' : ''}`}>{time}</span>
      </span>
      <span className="chat-item__bottom">
        <span className="chat-item__preview truncate">{typing ? `${name.split(' ')[0]} is typing...` : preview}</span>
        {mentioned && (
          <span className="chat-item__mention" title="You were mentioned" aria-label="You were mentioned">
            @
          </span>
        )}
        {unread > 0 && <span className="chat-item__badge">{unread > 99 ? '99+' : unread}</span>}
      </span>
    </span>
  </button>
)

export default ChatListItem
