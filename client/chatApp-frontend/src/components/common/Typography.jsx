const cx = (...classes) => classes.filter(Boolean).join(' ')

export const CarouselHeading = ({ as: Tag = 'h1', className, ...rest }) => (
  <Tag className={cx('t-display', className)} {...rest} />
)

export const Heading = ({ level = 1, as, className, ...rest }) => {
  const Tag = as || `h${level}`
  return <Tag className={cx(level === 1 ? 't-h1' : 't-h2', className)} {...rest} />
}

export const SubHeading = ({ as: Tag = 'p', className, ...rest }) => (
  <Tag className={cx('t-sub-heading', className)} {...rest} />
)

export const Paragraph = ({ muted, className, ...rest }) => (
  <p className={cx('t-body', muted && 't-muted', className)} {...rest} />
)

export const Text = ({ variant = 'body', as: Tag = 'span', muted, truncate, className, ...rest }) => (
  <Tag className={cx(`t-${variant}`, muted && 't-muted', truncate && 'truncate', className)} {...rest} />
)
