import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Sirf logged-in user ke liye. Login nahi to /login par bhej do.
const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
