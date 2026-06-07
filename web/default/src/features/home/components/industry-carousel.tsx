import { useState } from 'react'

interface IndustryCard {
  title: string
  desc: string
  img: string
}

interface IndustryCarouselProps {
  cards: IndustryCard[]
}

export function IndustryCarousel({ cards }: IndustryCarouselProps) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  // Which card is expanded: clicked one (locked) or hovered one (preview)
  const expanded = hovered !== null ? hovered : active

  return (
    <div>
      {/* Desktop: horizontal accordion — hover to preview, click to lock */}
      <div
        style={{
          height: 406,
          borderRadius: 8,
          display: 'flex',
          overflow: 'hidden',
          userSelect: 'none',
        }}
        className="when-mobile-screen:hidden"
      >
        {cards.map((card, i) => {
          const isExpanded = i === expanded
          return (
            <div
              key={i}
              onClick={() => { setActive(i); setHovered(null) }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                height: '100%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                width: isExpanded ? 712 : 180,
                backgroundImage: `url(${card.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRight: i < cards.length - 1 ? '1px solid rgba(0,74,143,0.08)' : 'none',
                borderBottom: isExpanded ? '3px solid #0080C0' : '2px solid rgba(255,255,255,0.2)',
                flexShrink: 0,
                transition: 'width 0.5s ease-out',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Brand overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,42,96,0.25) 0%, rgba(0,42,96,0.45) 100%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              {isExpanded ? (
                <section style={{ padding: '0 40px', position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: 40, fontWeight: 600, marginBottom: 20 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 16, lineHeight: 1.7 }}>{card.desc}</p>
                </section>
              ) : (
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '0 26px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {card.title}
                </h3>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: horizontal scroll snap */}
      <div
        className="hidden when-mobile-screen:flex"
        style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', gap: 12, paddingBottom: 12 }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              minWidth: '85vw', height: 438, borderRadius: 8,
              backgroundImage: `url(${card.img})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              color: '#fff', padding: '25px 30px',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(0,42,96,0.25) 0%, rgba(0,42,96,0.45) 100%)',
              pointerEvents: 'none', zIndex: 0 }} />
            <h3 style={{ fontSize: 40, fontWeight: 600, marginBottom: 17, lineHeight: 1, position: 'relative', zIndex: 1 }}>{card.title}</h3>
            <p style={{ fontSize: 16, position: 'relative', zIndex: 1 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
