import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Login / signup pages. User pehle se logged in ho to Home par bhej do.
const AuthRoute = () => {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />
}

export default AuthRoute
