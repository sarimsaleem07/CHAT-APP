import { useState } from 'react'
import { Input } from 'antd'
import { FiSearch, FiUsers } from 'react-icons/fi'
import SidePanel from '../../common/SidePanel/SidePanel'
import ContactItem from './ContactItem'
import NewGroupPanel from './NewGroupPanel'
import { LIMITS } from '../../../validations/rules'
import { filterContacts } from '../../../utils/contacts'
import { ContactListSkeleton } from '../../common/Skeleton/Skeleton'
import useSimulatedLoading from '../../../hooks/useSimulatedLoading'
import './NewChat.css'

const NewChatPanel = ({ contacts, startWithGroup = false, onClose, onStartChat, onCreateGroup }) => {
  const [search, setSearch] = useState('')
  const [groupOpen, setGroupOpen] = useState(startWithGroup)

  // TODO: replace with the contacts API's isLoading
  const loading = useSimulatedLoading('contacts', 500)
  const results = filterContacts(contacts, search)

  return (
    <>
      <SidePanel title="New chat" onBack={onClose}>
        <div className="new-chat__search">
          <Input
            variant="filled"
            prefix={<FiSearch className="new-chat__search-icon" />}
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={LIMITS.searchMax}
            allowClear
            autoFocus
          />
        </div>

        <button type="button" className="new-chat__group-btn" onClick={() => setGroupOpen(true)}>
          <span className="new-chat__group-icon">
            <FiUsers />
          </span>
          New group
        </button>

        <p className="new-chat__section">Contacts on ChatApp</p>
        <div className="new-chat__list">
          {loading && <ContactListSkeleton />}
          {!loading &&
            results.map((contact) => (
              <ContactItem key={contact.id} contact={contact} onClick={() => onStartChat(contact)} />
            ))}
          {!loading && results.length === 0 && (
            <p className="new-chat__empty">
              No contacts found for “<strong>{search.trim()}</strong>”
            </p>
          )}
        </div>
      </SidePanel>

      {groupOpen && (
        <NewGroupPanel
          contacts={contacts}
          loading={loading}
          onBack={startWithGroup ? onClose : () => setGroupOpen(false)}
          onCreate={onCreateGroup}
        />
      )}
    </>
  )
}

export default NewChatPanel
