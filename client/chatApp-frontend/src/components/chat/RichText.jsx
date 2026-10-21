import Highlight from '../common/Highlight/Highlight'
import { MENTION_SELF_ID, splitByMentions } from '../../utils/mentions'
import './chat.css'

// Message text with @mentions styled and search matches highlighted
const RichText = ({ text = '', mentions, highlight }) =>
  splitByMentions(text, mentions).map((part, i) =>
    part.mention ? (
      <span
        key={i}
        className={`mention ${
          part.mention.id === MENTION_SELF_ID ? 'mention--self' : `mention--${part.mention.color || 'blue'}`
        }`}
        title={part.mention.name}
      >
        @<Highlight text={part.mention.name} query={highlight} />
      </span>
    ) : (
      <Highlight key={i} text={part.text} query={highlight} />
    ),
  )

export default RichText
