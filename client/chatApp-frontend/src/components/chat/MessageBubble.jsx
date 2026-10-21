import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'
import RichText from './RichText'
import './chat.css'

export const MessageMeta = ({ direction, time, status }) =>
  time ? (
    <span className="bubble__meta">
      {time}
      {direction === 'out' && status === 'sent' && <IoCheckmark className="bubble__tick" />}
      {direction === 'out' && status === 'read' && <IoCheckmarkDone className="bubble__tick" />}
    </span>
  ) : null

// group chats: name of the person who sent the message
export const SenderName = ({ sender }) =>
  sender ? <span className={`bubble__sender sender--${sender.color || 'gray'}`}>{sender.name}</span> : null

const MessageBubble = ({ direction = 'in', time, status, quote, sender, highlight, mentions, children }) => (
  <div className={`bubble bubble--${direction}`}>
    <SenderName sender={sender} />
    {quote}
    <p className="bubble__text">
      <RichText text={children} mentions={mentions} highlight={highlight} />
    </p>
    <MessageMeta direction={direction} time={time} status={status} />
  </div>
)

export default MessageBubble
