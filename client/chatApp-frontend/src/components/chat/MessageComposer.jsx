import { useRef, useState } from 'react'
import { Popover } from 'antd'
import { useFormik } from 'formik'
import { FiCornerUpLeft, FiFile, FiPaperclip, FiSend, FiSmile, FiX } from 'react-icons/fi'
import EmojiPicker from './EmojiPicker/EmojiPicker'
import MentionList from './MentionList'
import useFilePreview from '../../hooks/useFilePreview'
import { composerSchema } from '../../validations/chatSchemas'
import { ATTACHMENT_TYPES, LIMITS } from '../../validations/rules'
import { formatFileSize } from '../../utils/file'
import { activeMentions, filterMembers, getMentionQuery, splitByMentions } from '../../utils/mentions'
import './ChatWindow.css'

const ACCEPT = Object.keys(ATTACHMENT_TYPES).join(',')

// members: group members that can be @mentioned (null in 1:1 chats)
const MessageComposer = ({ onSend, replyTo, onCancelReply, members }) => {
  const inputRef = useRef(null)
  const backdropRef = useRef(null)
  const fileRef = useRef(null)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [mention, setMention] = useState(null)
  const [mentionIndex, setMentionIndex] = useState(0)

  const formik = useFormik({
    initialValues: { text: '', attachment: null, mentions: [] },
    validationSchema: composerSchema,
    onSubmit: ({ text, attachment, mentions }, { resetForm }) => {
      const clean = text.trim()
      onSend({ text: clean, attachment, preview, replyTo, mentions: activeMentions(clean, mentions) })
      resetForm()
      setMention(null)
      onCancelReply?.()
      inputRef.current?.focus()
    },
  })

  const { values, errors, setFieldValue } = formik
  const preview = useFilePreview(errors.attachment ? null : values.attachment)
  const canSend = formik.isValid && (values.attachment || values.text.trim())

  const liveMentions = activeMentions(values.text, values.mentions)
  const alreadyMentioned = new Set(liveMentions.map((m) => m.id))

  // keep the coloured copy behind the input scrolled with it
  const syncScroll = () =>
    requestAnimationFrame(() => {
      if (backdropRef.current && inputRef.current) backdropRef.current.scrollLeft = inputRef.current.scrollLeft
    })
  const available = members?.filter((m) => !alreadyMentioned.has(m.id)) ?? []
  const results = mention ? filterMembers(available, mention.query).slice(0, 8) : []
  const mentionOpen = results.length > 0

  const updateMention = (text, caret) => {
    if (!members?.length) return
    const next = getMentionQuery(text, caret)
    if (next?.query !== mention?.query || next?.start !== mention?.start) setMentionIndex(0)
    setMention(next)
  }

  const selectMention = (member) => {
    const input = inputRef.current
    const caret = input?.selectionStart ?? values.text.length
    const insert = `@${member.name} `
    const next = values.text.slice(0, mention.start) + insert + values.text.slice(caret)
    if (next.length > LIMITS.messageMax) return
    setFieldValue('text', next)
    if (!values.mentions.some((m) => m.id === member.id)) {
      setFieldValue('mentions', [...values.mentions, { id: member.id, name: member.name, color: member.color }])
    }
    setMention(null)
    const pos = mention.start + insert.length
    requestAnimationFrame(() => {
      input?.focus()
      input?.setSelectionRange(pos, pos)
    })
  }

  const insertEmoji = (emoji) => {
    const input = inputRef.current
    const start = input?.selectionStart ?? values.text.length
    const end = input?.selectionEnd ?? values.text.length
    const next = values.text.slice(0, start) + emoji + values.text.slice(end)
    if (next.length > LIMITS.messageMax) return
    setFieldValue('text', next)
    requestAnimationFrame(() => {
      input?.focus()
      input?.setSelectionRange(start + emoji.length, start + emoji.length)
    })
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setFieldValue('attachment', file)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (mentionOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const dir = e.key === 'ArrowDown' ? 1 : -1
        setMentionIndex((i) => (i + dir + results.length) % results.length)
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        selectMention(results[Math.min(mentionIndex, results.length - 1)])
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setMention(null)
        return
      }
    }
    if (e.key === 'Escape') {
      if (values.attachment) setFieldValue('attachment', null)
      else onCancelReply?.()
    }
  }

  return (
    <div className="composer-wrap">
      {mentionOpen && (
        <MentionList
          members={results}
          activeIndex={Math.min(mentionIndex, results.length - 1)}
          onSelect={selectMention}
          onHover={setMentionIndex}
        />
      )}

      {replyTo && (
        <div className="composer-bar composer-bar--reply">
          <FiCornerUpLeft className="composer-bar__icon" />
          <div className="composer-bar__body">
            <span className="composer-bar__title">Replying to {replyTo.name}</span>
            <span className="composer-bar__text truncate">{replyTo.text}</span>
          </div>
          <button type="button" className="icon-btn" onClick={onCancelReply} aria-label="Cancel reply">
            <FiX />
          </button>
        </div>
      )}

      {values.attachment && (
        <div className={`composer-bar ${errors.attachment ? 'composer-bar--error' : ''}`}>
          {preview ? (
            <img src={preview} alt="" className="composer-bar__thumb" />
          ) : (
            <span className="composer-bar__file">
              <FiFile />
            </span>
          )}
          <div className="composer-bar__body">
            <span className="composer-bar__title truncate">{values.attachment.name}</span>
            <span className="composer-bar__text">
              {errors.attachment ||
                `${ATTACHMENT_TYPES[values.attachment.type] || 'File'} · ${formatFileSize(values.attachment.size)}`}
            </span>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setFieldValue('attachment', null)}
            aria-label="Remove attachment"
          >
            <FiX />
          </button>
        </div>
      )}

      <form className="composer" onSubmit={formik.handleSubmit}>
        <Popover
          content={<EmojiPicker onSelect={insertEmoji} />}
          trigger="click"
          open={emojiOpen}
          onOpenChange={setEmojiOpen}
          placement="topLeft"
          arrow={false}
        >
          <button type="button" className={`icon-btn ${emojiOpen ? 'icon-btn--active' : ''}`} aria-label="Emoji">
            <FiSmile />
          </button>
        </Popover>
        <button type="button" className="icon-btn" aria-label="Attach file" onClick={() => fileRef.current?.click()}>
          <FiPaperclip />
        </button>
        <input ref={fileRef} type="file" accept={ACCEPT} hidden onChange={handleFile} />

        <div className="composer__field">
          {/* same text as the input, drawn underneath so @mentions can be coloured */}
          <div ref={backdropRef} className="composer__backdrop" aria-hidden="true">
            {splitByMentions(values.text, liveMentions).map((part, i) =>
              part.mention ? (
                <span key={i} className={`mention mention--inline mention--${part.mention.color || 'blue'}`}>
                  @{part.mention.name}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
            {'\u200b'}
          </div>
          <input
            ref={inputRef}
            name="text"
            className="composer__input"
            placeholder={
              values.attachment
                ? 'Add a caption (optional)'
                : members
                  ? 'Type a message, @ to mention'
                  : 'Type a message'
            }
            value={values.text}
            onChange={(e) => {
              formik.handleChange(e)
              updateMention(e.target.value, e.target.selectionStart)
              syncScroll()
            }}
            onSelect={(e) => {
              updateMention(e.target.value, e.target.selectionStart)
              syncScroll()
            }}
            onScroll={syncScroll}
            onBlur={() => setMention(null)}
            onKeyDown={handleKeyDown}
            aria-autocomplete={members ? 'list' : undefined}
            aria-expanded={members ? mentionOpen : undefined}
            autoComplete="off"
            maxLength={LIMITS.messageMax}
          />
        </div>
        <button type="submit" className="composer__send" aria-label="Send" disabled={!canSend}>
          <FiSend />
        </button>
      </form>

      {values.text.length > LIMITS.messageMax - 200 && (
        <p className="composer__counter">
          {values.text.length} / {LIMITS.messageMax}
        </p>
      )}
    </div>
  )
}

export default MessageComposer
