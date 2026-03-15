import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,255,0,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,255,0,0.1) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-2px',
              display: 'flex',
            }}
          >
            10xSpend
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#C8FF00',
              display: 'flex',
            }}
          >
            AI Ad Analysis Platform
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '20px',
              color: '#777777',
              maxWidth: '600px',
              textAlign: 'center',
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            Scores, heatmaps, persona feedback, and fix-it suggestions — in seconds
          </div>

          {/* Score ring mockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '4px solid #C8FF00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 700,
                color: '#C8FF00',
              }}
            >
              8.4
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {['Hook Strength', 'Visual Clarity', 'CTA Power'].map((label) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '120px',
                      height: '8px',
                      borderRadius: '4px',
                      background: 'linear-gradient(to right, #C8FF00, #00FF87)',
                      display: 'flex',
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#777777', display: 'flex' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
