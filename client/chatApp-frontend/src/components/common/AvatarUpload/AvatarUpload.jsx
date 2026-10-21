import { useRef } from 'react'
import useFilePreview from '../../../hooks/useFilePreview'
import { FiCamera, FiTrash2 } from 'react-icons/fi'
import Avatar from '../Avatar/Avatar'
import { IMAGE_TYPES } from '../../../validations/rules'
import './AvatarUpload.css'

// value: File | string (url) | null
const AvatarUpload = ({ name = '', value, onChange, error, size = 112 }) => {
  const inputRef = useRef(null)
  const filePreview = useFilePreview(value instanceof File ? value : null, IMAGE_TYPES)
  const preview = value instanceof File ? filePreview : typeof value === 'string' ? value : null

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) onChange(file)
  }

  return (
    <div className="avatar-upload">
      <button
        type="button"
        className={`avatar-upload__btn ${error ? 'avatar-upload__btn--error' : ''}`}
        style={{ width: size, height: size }}
        onClick={() => inputRef.current?.click()}
        aria-label="Choose photo"
      >
        <Avatar name={name || '?'} src={preview} color={preview ? undefined : 'gray'} size={size} />
        <span className="avatar-upload__overlay">
          <FiCamera />
          <span>{preview ? 'Change' : 'Add photo'}</span>
        </span>
      </button>

      {value && (
        <button type="button" className="avatar-upload__remove" onClick={() => onChange(null)}>
          <FiTrash2 /> Remove photo
        </button>
      )}

      <input ref={inputRef} type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={handleFile} />
      {error && <p className="avatar-upload__error">{error}</p>}
    </div>
  )
}

export default AvatarUpload
