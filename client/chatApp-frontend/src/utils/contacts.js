export const filterContacts = (contacts, query) => {
  const q = query.trim().toLowerCase()
  const list = q ? contacts.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) : contacts
  return [...list].sort((a, b) => a.name.localeCompare(b.name))
}
