import './Avatar.css'

const COLORS = ['peach', 'blue', 'mint', 'purple', 'rose', 'gray', 'yellow']

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

const colorFromName = (name = '') => COLORS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % COLORS.length]

const Avatar = ({ name, src, color, size = 48, online }) => (
  <span className={`avatar avatar--${color || colorFromName(name)}`} style={{ width: size, height: size }}>
    {src ? <img src={src} alt={name} /> : getInitials(name)}
    {online && <span className="avatar__online" />}
  </span>
)

export default Avatar
