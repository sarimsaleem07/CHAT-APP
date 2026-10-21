import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'chatapp-user'

const AuthContext = createContext(null)

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser)

  // TODO: API se token aayega, abhi sirf user save kar rahe hain
  const login = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // storage full (big photo) — keep it in memory only
      }
      return next
    })
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, updateUser, logout }}>{children}</AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
