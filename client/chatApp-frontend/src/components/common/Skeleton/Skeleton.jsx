import './Skeleton.css'

// Basic shimmering block. circle → round avatar placeholder.
export const SkeletonBlock = ({ width = '100%', height = 12, radius = 6, circle, className = '', style }) => (
  <span
    className={`skeleton ${className}`}
    style={{
      width: circle ? height : width,
      height,
      borderRadius: circle ? '50%' : radius,
      ...style,
    }}
    aria-hidden="true"
  />
)

// Wraps any skeleton so screen readers hear "Loading" once
export const SkeletonGroup = ({ label = 'Loading', className = '', children }) => (
  <div className={`skeleton-group ${className}`} role="status" aria-live="polite" aria-label={label}>
    {children}
  </div>
)

const NAME_WIDTHS = ['55%', '40%', '65%', '48%', '58%', '35%', '62%', '45%']
const PREVIEW_WIDTHS = ['80%', '70%', '88%', '60%', '75%', '85%', '66%', '72%']

export const ChatListSkeleton = ({ rows = 7 }) => (
  <SkeletonGroup label="Loading chats" className="skeleton-list">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="skeleton-row">
        <SkeletonBlock circle height={48} />
        <div className="skeleton-row__body">
          <div className="skeleton-row__top">
            <SkeletonBlock width={NAME_WIDTHS[i % 8]} height={14} />
            <SkeletonBlock width={36} height={10} />
          </div>
          <SkeletonBlock width={PREVIEW_WIDTHS[i % 8]} height={12} />
        </div>
      </div>
    ))}
  </SkeletonGroup>
)

export const ContactListSkeleton = ({ rows = 6 }) => (
  <SkeletonGroup label="Loading contacts" className="skeleton-list">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="skeleton-row">
        <SkeletonBlock circle height={44} />
        <div className="skeleton-row__body">
          <SkeletonBlock width={NAME_WIDTHS[i % 8]} height={14} />
          <SkeletonBlock width={PREVIEW_WIDTHS[(i + 3) % 8]} height={12} />
        </div>
      </div>
    ))}
  </SkeletonGroup>
)

// in/out pattern so it looks like a real conversation
const BUBBLES = [
  { dir: 'in', w: 260, h: 44 },
  { dir: 'out', w: 320, h: 44 },
  { dir: 'in', w: 200, h: 44 },
  { dir: 'in', w: 300, h: 64 },
  { dir: 'out', w: 240, h: 44 },
  { dir: 'out', w: 180, h: 44 },
  { dir: 'in', w: 280, h: 44 },
]

export const MessagesSkeleton = () => (
  <SkeletonGroup label="Loading messages" className="skeleton-messages">
    <SkeletonBlock width={64} height={20} radius={999} className="skeleton-messages__date" />
    {BUBBLES.map((b, i) => (
      <SkeletonBlock
        key={i}
        width={`min(${b.w}px, 70%)`}
        height={b.h}
        radius={14}
        className={`skeleton-bubble skeleton-bubble--${b.dir}`}
      />
    ))}
  </SkeletonGroup>
)

export const ChatInfoMediaSkeleton = () => (
  <SkeletonGroup label="Loading media" className="skeleton-media">
    <div className="skeleton-media__grid">
      {Array.from({ length: 6 }, (_, i) => (
        <SkeletonBlock key={i} height="auto" radius={8} className="skeleton-media__thumb" />
      ))}
    </div>
    {Array.from({ length: 2 }, (_, i) => (
      <div key={i} className="skeleton-row skeleton-row--flat">
        <SkeletonBlock width={40} height={40} radius={10} />
        <div className="skeleton-row__body">
          <SkeletonBlock width="60%" height={12} />
          <SkeletonBlock width="40%" height={10} />
        </div>
      </div>
    ))}
  </SkeletonGroup>
)
