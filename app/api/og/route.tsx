import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Dynamic Open Graph image (1200x630) for the whole ecosystem.
// Usage: /api/og?title=...&subtitle=...&tag=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') || 'Badreddine EL KHAMLICHI').slice(0, 80);
  const subtitle = (searchParams.get('subtitle') || 'Data Scientist · Engineer · Builder').slice(0, 90);
  const tag = (searchParams.get('tag') || 'badreddineek.com').slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'linear-gradient(135deg, #07191b 0%, #0c3438 55%, #01696f 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: '#01696f',
              border: '2px solid #4f98a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            BK
          </div>
          <div style={{ marginLeft: 28, fontSize: 30, color: '#9fc6cc', letterSpacing: 2 }}>
            Badreddine EK
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: '#f7f6f2',
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 24, fontSize: 38, color: '#bfe0e4', fontWeight: 500 }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ height: 8, width: 64, background: '#4f98a3', borderRadius: 4 }} />
          <div style={{ marginLeft: 20, fontSize: 28, color: '#9fc6cc' }}>{tag}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
