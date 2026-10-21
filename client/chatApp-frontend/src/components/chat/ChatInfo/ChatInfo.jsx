import { Image } from 'antd'
import { FiFile, FiMail, FiX } from 'react-icons/fi'
import Avatar from '../../common/Avatar/Avatar'
import ContactItem from '../NewChat/ContactItem'
import { useAuth } from '../../../context/AuthContext'
import { ChatInfoMediaSkeleton } from '../../common/Skeleton/Skeleton'
import './ChatInfo.css'

const ChatInfo = ({ chat, contacts, messages = [], loading, onClose, onMessageContact }) => {
  const { user } = useAuth()
  const contact = chat.isGroup ? null : contacts.find((c) => c.id === chat.contactId)
  const members = chat.isGroup
    ? (chat.members || []).map((id) => contacts.find((c) => c.id === id)).filter(Boolean)
    : []

  const visible = messages.filter((m) => !m.deleted)
  const media = visible.filter((m) => m.type === 'image')
  const files = visible.filter((m) => m.type === 'file')

  return (
    <aside className="chat-info" aria-label={chat.isGroup ? 'Group info' : 'Contact info'}>
      <header className="chat-info__header">
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close info">
          <FiX />
        </button>
        <h2 className="chat-info__heading">{chat.isGroup ? 'Group info' : 'Contact info'}</h2>
      </header>

      <div className="chat-info__body">
        <section className="chat-info__profile">
          <Avatar
            name={chat.name}
            src={chat.avatar}
            color={chat.color}
            size={96}
            online={!chat.isGroup && chat.online}
          />
          <h3 className="chat-info__name">{chat.name}</h3>
          <p className="chat-info__sub">
            {chat.isGroup ? `Group · ${members.length + 1} members` : chat.online ? 'online' : 'offline'}
          </p>
        </section>

        {contact && (
          <section className="chat-info__section">
            <p className="chat-info__label">About</p>
            <p className="chat-info__text">{contact.about || 'Hey there! I am using ChatApp'}</p>
            <p className="chat-info__label">Email</p>
            <p className="chat-info__text chat-info__email">
              <FiMail /> <span className="truncate">{contact.email}</span>
            </p>
          </section>
        )}

        <section className="chat-info__section">
          {loading ? (
            <>
              <p className="chat-info__label">Media &amp; files</p>
              <ChatInfoMediaSkeleton />
            </>
          ) : (
            <>
              <p className="chat-info__label">
                Media <span className="chat-info__count">{media.length}</span>
              </p>
              {media.length ? (
                <Image.PreviewGroup>
                  <div className="chat-info__media">
                    {media.map((m) => (
                      <Image key={m.id} src={m.src} alt={m.name || 'Photo'} className="chat-info__thumb" />
                    ))}
                  </div>
                </Image.PreviewGroup>
              ) : (
                <p className="chat-info__empty">No photos shared yet</p>
              )}

              <p className="chat-info__label">
                Files <span className="chat-info__count">{files.length}</span>
              </p>
              {files.length ? (
                <ul className="chat-info__files">
                  {files.map((f) => (
                    <li key={f.id} className="chat-info__file">
                      <span className="chat-info__file-icon">
                        <FiFile />
                      </span>
                      <span className="chat-info__file-info">
                        <span className="chat-info__file-name truncate">{f.name}</span>
                        <span className="chat-info__file-meta">
                          {f.fileType} · {f.size} · {f.time}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="chat-info__empty">No files shared yet</p>
              )}
            </>
          )}
        </section>

        {chat.isGroup && (
          <section className="chat-info__section">
            <p className="chat-info__label">
              Members <span className="chat-info__count">{members.length + 1}</span>
            </p>
            <div className="chat-info__you">
              <Avatar name={user?.name || 'You'} src={user?.avatar} size={44} />
              <span className="chat-info__you-body">
                <span className="chat-info__you-name">You</span>
                <span className="chat-info__file-meta">{user?.about || user?.email}</span>
              </span>
              <span className="chat-info__badge">Admin</span>
            </div>
            {members.map((m) => (
              <ContactItem key={m.id} contact={m} onClick={() => onMessageContact(m)} />
            ))}
          </section>
        )}
      </div>
    </aside>
  )
}

export default ChatInfo
