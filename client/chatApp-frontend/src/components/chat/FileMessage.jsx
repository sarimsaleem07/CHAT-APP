import { FiFile } from 'react-icons/fi'
import { MessageMeta, SenderName } from './MessageBubble'
import Highlight from '../common/Highlight/Highlight'
import RichText from './RichText'
import './chat.css'

const FileMessage = ({
  direction = 'in',
  name,
  type,
  size,
  time,
  status,
  caption,
  quote,
  sender,
  highlight,
  mentions,
}) => (
  <div className={`file-msg file-msg--${direction}`}>
    <SenderName sender={sender} />
    {quote}
    <div className="file-msg__row">
      <span className="file-msg__icon">
        <FiFile />
      </span>
      <span className="file-msg__info">
        <span className="file-msg__name truncate">
          <Highlight text={name} query={highlight} />
        </span>
        <span className="file-msg__meta">
          {type} · {size}
          {!caption && <> · {time}</>}
        </span>
      </span>
    </div>
    {caption && (
      <>
        <p className="bubble__text file-msg__caption">
          <RichText text={caption} mentions={mentions} highlight={highlight} />
        </p>
        <MessageMeta direction={direction} time={time} status={status} />
      </>
    )}
  </div>
)

export default FileMessage
