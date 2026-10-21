import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi'
import { CarouselHeading, SubHeading } from '../../components/common/Typography'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import './AuthLayout.css'

const AuthLayout = ({ title, subtitle, icon = <FiMessageCircle />, iconTone = 'primary', onBack, actions, footer, children }) => (
  <div className="auth">
    <div className="auth__inner">
      <div className="auth__top">
        {onBack ? (
          <button type="button" className="auth__back" onClick={onBack} aria-label="Go back">
            <FiArrowLeft />
          </button>
        ) : (
          <span />
        )}
        <ThemeToggle />
      </div>

      <div className={`auth__logo auth__logo--${iconTone}`}>{icon}</div>

      <CarouselHeading className="auth__title">{title}</CarouselHeading>
      {subtitle && <SubHeading className="auth__subtitle">{subtitle}</SubHeading>}

      <div className="auth__body">{children}</div>

      {actions && <div className="auth__actions">{actions}</div>}
      {footer && <p className="auth__footer">{footer}</p>}
    </div>
  </div>
)

export default AuthLayout
