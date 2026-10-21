export const messagePreviewText = (m) => {
  if (m.deleted) return 'This message was deleted'
  if (m.type === 'image') return m.text ? `📷 ${m.text}` : '📷 Photo'
  if (m.type === 'file') return `📄 ${m.name}`
  return m.text
}
