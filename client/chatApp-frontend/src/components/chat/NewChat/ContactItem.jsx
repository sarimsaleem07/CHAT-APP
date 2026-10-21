import { FiCheck } from 'react-icons/fi'
import Avatar from '../../common/Avatar/Avatar'
import './NewChat.css'

// selectable: shows a round checkbox on the right
const ContactItem = ({ contact, onClick, selectable, selected }) => (
  <button
    type="button"
    className={`contact-item ${selected ? 'contact-item--selected' : ''}`}
    onClick={onClick}
    role={selectable ? 'checkbox' : undefined}
    aria-checked={selectable ? selected : undefined}
  >
    <Avatar name={contact.name} src={contact.avatar} color={contact.color} size={44} online={contact.online} />
    <span className="contact-item__body">
      <span className="contact-item__name truncate">{contact.name}</span>
      <span className="contact-item__about truncate">{contact.about || contact.email}</span>
    </span>
    {selectable && <span className="contact-item__check">{selected && <FiCheck />}</span>}
  </button>
)

export default ContactItem
