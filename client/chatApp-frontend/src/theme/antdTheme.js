import { theme as antdTheme } from 'antd'
import { colors, fontFamily, typography, radius, controlHeight, layout } from './tokens'

export const getAntdTheme = (mode = 'light') => {
  const c = colors[mode]

  return {
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: c.primary,
      colorSuccess: c.success,
      colorError: c.danger,
      colorInfo: c.primary,
      colorLink: c.primary,

      colorBgBase: c.bg,
      colorBgLayout: c.bg,
      colorBgContainer: c.surface,
      colorBgElevated: c.surface,

      colorText: c.text,
      colorTextHeading: c.text,
      colorTextSecondary: c.textMuted,
      colorTextTertiary: c.textMuted,
      colorTextPlaceholder: c.textMuted,

      colorBorder: c.border,
      colorBorderSecondary: c.border,
      colorSplit: c.border,

      fontFamily: fontFamily.body,
      fontSize: typography.body.size,
      fontSizeSM: typography.caption.size,
      fontSizeHeading1: typography.h1.size,
      fontSizeHeading2: typography.h2.size,
      lineHeight: typography.body.lineHeight / typography.body.size,

      borderRadius: radius.input,
      borderRadiusSM: radius.input,
      borderRadiusLG: radius.card,

      controlHeight,
      controlHeightLG: 52,
      controlHeightSM: 32,
      boxShadow: 'none',
    },
    components: {
      Layout: {
        headerBg: c.surface,
        headerHeight: layout.headerHeight,
        siderBg: c.surface,
        bodyBg: c.bg,
      },
      Button: {
        fontWeight: typography.label.weight,
        contentFontSize: typography.label.size,
        contentFontSizeLG: 16,
        borderRadiusLG: radius.card,
        paddingInline: 20,
        primaryShadow: 'none',
        defaultShadow: 'none',
        dangerShadow: 'none',
      },
      Input: {
        paddingInline: 14,
        activeShadow: `0 0 0 3px ${c.primarySoft}`,
      },
      Card: {
        borderRadiusLG: radius.card,
      },
      Badge: {
        colorError: c.primary,
      },
      Menu: {
        itemBg: 'transparent',
        itemSelectedBg: c.primarySoft,
        itemSelectedColor: c.primary,
        itemBorderRadius: radius.card,
      },
    },
  }
}
