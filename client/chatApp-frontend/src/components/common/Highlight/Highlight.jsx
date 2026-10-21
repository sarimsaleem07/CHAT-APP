import './Highlight.css'

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Wraps every case-insensitive match of `query` in <mark>
const Highlight = ({ text = '', query = '' }) => {
  const q = query.trim()
  if (!q || !text) return text

  const parts = text.split(new RegExp(`(${escapeRegex(q)})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default Highlight
