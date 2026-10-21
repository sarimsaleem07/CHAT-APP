export const MENTION_SELF_ID = 'me'

// "@ay" right before the caret → { start: index of @, query: 'ay' }
export const getMentionQuery = (text, caret) => {
  const before = text.slice(0, caret)
  const match = before.match(/(^|\s)@([^\s@]{0,30})$/u)
  if (!match) return null
  return { start: before.length - match[2].length - 1, query: match[2] }
}

// match from the start of any word: "kh" finds "Ayesha Khan"
export const filterMembers = (members, query) => {
  const q = query.toLowerCase()
  if (!q) return members
  return members.filter((m) =>
    m.name
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.startsWith(q)),
  )
}

// drop mentions the user deleted from the text, and duplicates
export const activeMentions = (text, mentions = []) => {
  const seen = new Set()
  return mentions.filter((m) => {
    if (seen.has(m.id) || !text.includes(`@${m.name}`)) return false
    seen.add(m.id)
    return true
  })
}

// "Hi @Ayesha Khan!" → [{ text: 'Hi ' }, { mention }, { text: '!' }]
export const splitByMentions = (text = '', mentions = []) => {
  if (!mentions.length || !text) return [{ text }]
  const sorted = [...mentions].sort((a, b) => b.name.length - a.name.length)
  const parts = []
  let rest = text

  while (rest) {
    let best = null
    for (const m of sorted) {
      const idx = rest.indexOf(`@${m.name}`)
      if (idx !== -1 && (best === null || idx < best.idx)) best = { idx, m }
    }
    if (!best) {
      parts.push({ text: rest })
      break
    }
    if (best.idx > 0) parts.push({ text: rest.slice(0, best.idx) })
    parts.push({ mention: best.m })
    rest = rest.slice(best.idx + best.m.name.length + 1)
  }
  return parts
}
