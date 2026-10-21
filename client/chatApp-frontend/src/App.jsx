import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthRoute from './routes/AuthRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/Home/Home'
import Login from './pages/Auth/Login/Login'
import Signup from './pages/Auth/Signup/Signup'
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
