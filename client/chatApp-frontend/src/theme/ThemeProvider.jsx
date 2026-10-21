import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import { getAntdTheme } from './antdTheme'
import { buildCssVars } from './cssVars'

const STORAGE_KEY = 'chatapp-theme'

const ThemeContext = createContext({ mode: 'light', setMode: () => {}, toggleTheme: () => {} })

const getInitialMode = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // storage blocked
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode)

  useLayoutEffect(() => {
    const root = document.documentElement
    Object.entries(buildCssVars(mode)).forEach(([name, value]) => root.style.setProperty(name, value))
    root.setAttribute('data-theme', mode)
    root.style.colorScheme = mode
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // ignore
    }
  }, [mode])

  // Pass the click event to grow the new theme as a circle from the toggle button.
  const toggleTheme = useCallback(
    (event) => {
      const next = mode === 'dark' ? 'light' : 'dark'
      const root = document.documentElement

      if (!document.startViewTransition || prefersReducedMotion()) {
        root.classList.add('theme-fade')
        setMode(next)
        setTimeout(() => root.classList.remove('theme-fade'), 400)
        return
      }

      const rect = event?.currentTarget?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : 0
      const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

      const transition = document.startViewTransition(() => {
        flushSync(() => setMode(next))
      })

      transition.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
          { duration: 550, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
    },
    [mode],
  )

  const value = useMemo(() => ({ mode, setMode, toggleTheme }), [mode, toggleTheme])
  const antdTheme = useMemo(() => getAntdTheme(mode), [mode])

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)
