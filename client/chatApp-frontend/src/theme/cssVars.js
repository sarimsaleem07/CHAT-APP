import { colors, fontFamily, typography, spacing, radius, controlHeight, shadow, layout } from './tokens'

const kebab = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase()

// tokens → CSS variables, e.g. --color-primary, --fs-h1, --space-4, --radius-card
export const buildCssVars = (mode) => {
  const vars = {}

  Object.entries(colors[mode]).forEach(([key, value]) => {
    vars[`--color-${kebab(key)}`] = value
  })

  vars['--font-heading'] = fontFamily.heading
  vars['--font-body'] = fontFamily.body

  Object.entries(typography).forEach(([key, t]) => {
    const name = kebab(key)
    vars[`--fs-${name}`] = `${t.size}px`
    vars[`--lh-${name}`] = `${t.lineHeight}px`
    vars[`--fw-${name}`] = t.weight
    vars[`--ff-${name}`] = `var(--font-${t.family})`
  })

  Object.entries(spacing).forEach(([key, value]) => {
    vars[`--space-${key}`] = `${value}px`
  })

  Object.entries(radius).forEach(([key, value]) => {
    vars[`--radius-${key}`] = `${value}px`
  })

  vars['--control-height'] = `${controlHeight}px`
  vars['--shadow'] = shadow[mode]
  vars['--sidebar-width'] = `${layout.sidebarWidth}px`
  vars['--header-height'] = `${layout.headerHeight}px`

  return vars
}
