import { FiCheck, FiCircle } from 'react-icons/fi'
import { PASSWORD_RULES } from '../../../validations/rules'
import './PasswordHints.css'

const Hint = ({ ok, children }) => (
  <li className={ok ? 'password-hints__ok' : ''}>
    {ok ? <FiCheck /> : <FiCircle />}
    {children}
  </li>
)

const PasswordHints = ({ password = '', confirmPassword }) => (
  <ul className="password-hints" aria-label="Password requirements">
    {PASSWORD_RULES.map((rule) => (
      <Hint key={rule.id} ok={rule.test(password)}>
        {rule.label}
      </Hint>
    ))}
    {confirmPassword !== undefined && <Hint ok={!!password && password === confirmPassword}>Passwords match</Hint>}
  </ul>
)

export default PasswordHints
