import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../../theme'
import './ThemeToggle.css'

const ThemeToggle = ({ className = '' }) => {
  const { mode, toggleTheme } = useTheme()
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`theme-toggle ${isDark ? 'theme-toggle--dark' : ''} ${className}`}
      onClick={toggleTheme}
    >
      <span className="theme-toggle__stars" aria-hidden="true" />
      <span className="theme-toggle__knob">
        <FiSun className="theme-toggle__icon theme-toggle__icon--sun" />
        <FiMoon className="theme-toggle__icon theme-toggle__icon--moon" />
      </span>
    </button>
  )
}

export default ThemeToggle
