// Calm Indigo UI kit — saari values sirf yahan. CSS variables aur antd dono yahin se bante hain.

export const colors = {
  light: {
    primary: '#3B5BDB',
    primaryHover: '#3451C7',
    primaryActive: '#2C45AD',
    primarySoft: '#EEF2FF',
    text: '#111827',
    textMuted: '#5B6472',
    textInverse: '#FFFFFF',
    bg: '#F4F6FA',
    surface: '#FFFFFF',
    surfaceHover: '#F8F9FC',
    border: '#E3E7EE',
    success: '#12805C',
    danger: '#D63B3B',
    dangerHover: '#BF3232',
    bubbleIn: '#FFFFFF',
    bubbleInText: '#111827',
    bubbleOut: '#3B5BDB',
    bubbleOutText: '#FFFFFF',
  },
  dark: {
    primary: '#7C93FF',
    primaryHover: '#94A7FF',
    primaryActive: '#6A82F0',
    primarySoft: 'rgba(124, 147, 255, 0.14)',
    text: '#E6EAF0',
    textMuted: '#9AA4B2',
    textInverse: '#0F141C',
    bg: '#0F141C',
    surface: '#18202B',
    surfaceHover: '#1F2834',
    border: '#2A3442',
    success: '#2FB37E',
    danger: '#E5534B',
    dangerHover: '#F06A62',
    bubbleIn: '#18202B',
    bubbleInText: '#E6EAF0',
    bubbleOut: '#7C93FF',
    bubbleOutText: '#0F141C',
  },
}

export const fontFamily = {
  heading: "'Plus Jakarta Sans', 'Inter', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

// size / lineHeight px mein
export const typography = {
  display: { family: 'heading', size: 40, lineHeight: 48, weight: 700 }, // carousel / hero heading
  h1: { family: 'heading', size: 28, lineHeight: 36, weight: 700 },
  h2: { family: 'heading', size: 20, lineHeight: 28, weight: 600 }, // chat name bhi
  subHeading: { family: 'body', size: 16, lineHeight: 24, weight: 400 },
  body: { family: 'body', size: 15, lineHeight: 22, weight: 400 }, // paragraph & message
  label: { family: 'body', size: 14, lineHeight: 20, weight: 500 }, // label & button
  caption: { family: 'body', size: 12, lineHeight: 16, weight: 400 }, // time, typing...
  eyebrow: { family: 'body', size: 13, lineHeight: 16, weight: 600 },
}

export const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32 }

export const radius = {
  input: 8,
  card: 12,
  bubble: 18,
  pill: 9999,
}

export const controlHeight = 44

export const shadow = {
  light: '0 1px 2px rgba(17, 24, 39, 0.04)',
  dark: '0 1px 2px rgba(0, 0, 0, 0.4)',
}

export const layout = {
  sidebarWidth: 340,
  headerHeight: 64,
}
