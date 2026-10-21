import { Image } from 'antd'
import { MessageMeta, SenderName } from './MessageBubble'
import RichText from './RichText'
import './chat.css'

const ImageMessage = ({ direction = 'in', src, name, caption, time, status, quote, sender, highlight, mentions }) => (
  <div className={`image-msg image-msg--${direction}`}>
    {sender && (
      <span className="image-msg__sender">
        <SenderName sender={sender} />
      </span>
    )}
    {quote}
    <Image src={src} alt={name || 'Photo'} className="image-msg__img" />
    {caption ? (
      <div className="image-msg__caption">
        <p className="bubble__text">
          <RichText text={caption} mentions={mentions} highlight={highlight} />
        </p>
        <MessageMeta direction={direction} time={time} status={status} />
      </div>
    ) : (
      <span className="image-msg__overlay-meta">
        <MessageMeta direction={direction} time={time} status={status} />
      </span>
    )}
  </div>
)

export default ImageMessage
