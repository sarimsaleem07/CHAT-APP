import { FiArrowLeft } from 'react-icons/fi'
import './SidePanel.css'

// Slides over the sidebar (New chat, New group, Profile...)
const SidePanel = ({ title, onBack, footer, children }) => (
  <section className="side-panel" aria-label={title}>
    <header className="side-panel__header">
      <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
        <FiArrowLeft />
      </button>
      <h2 className="side-panel__title">{title}</h2>
    </header>
    <div className="side-panel__body">{children}</div>
    {footer && <div className="side-panel__footer">{footer}</div>}
  </section>
)

export default SidePanel
