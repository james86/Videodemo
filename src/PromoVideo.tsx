import React from 'react';
import { Sequence, useCurrentFrame, interpolate, Easing } from 'remotion';

interface ScreenShot {
  frame: number;
  duration: number;
  path: string;
  title: string;
}

const screenshots: ScreenShot[] = [
  { frame: 0, duration: 60, path: './screenshots/01-bbc-home.png', title: 'BBC News' },
  { frame: 60, duration: 60, path: './screenshots/02-england-news.png', title: 'England News' },
  { frame: 120, duration: 80, path: './screenshots/03-northern-ireland.png', title: 'Northern Ireland' },
  { frame: 200, duration: 60, path: './screenshots/04-northern-ireland-scroll.png', title: 'Latest Stories' },
  { frame: 260, duration: 70, path: './screenshots/05-news-article.png', title: 'Read Full Stories' },
  { frame: 330, duration: 50, path: './screenshots/06-back-to-region.png', title: 'Stay Updated' },
];

const TextOverlay: React.FC<{ title: string; startFrame: number; duration: number }> = ({
  title,
  startFrame,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - startFrame, [0, 10, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: 60,
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadow: '0 4px 8px rgba(0,0,0,0.8)',
        opacity,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {title}
    </div>
  );
};

const FadeTransition: React.FC<{ children: React.ReactNode; duration: number }> = ({
  children,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  return <div style={{ opacity }}>{children}</div>;
};

const StaticImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url("${src}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

export const PromoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Opening Title */}
      <Sequence from={0} durationInFrames={90}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #000080 0%, #1e1e3f 100%)',
            position: 'relative',
          }}
        >
          <div style={{ textAlign: 'center', opacity: interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0]) }}>
            <h1
              style={{
                fontSize: 96,
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: 0,
                fontFamily: 'Arial, sans-serif',
                textShadow: '0 4px 16px rgba(0,0,0,0.8)',
              }}
            >
              BBC Northern
            </h1>
            <h2
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#FF0000',
                margin: '20px 0 0 0',
                fontFamily: 'Arial, sans-serif',
                textShadow: '0 4px 16px rgba(0,0,0,0.8)',
              }}
            >
              News
            </h2>
          </div>
        </div>
      </Sequence>

      {/* Screenshot Sequences */}
      {screenshots.map((ss, idx) => (
        <Sequence key={idx} from={ss.frame} durationInFrames={ss.duration}>
          <FadeTransition duration={ss.duration}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <StaticImage src={ss.path} />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)',
                }}
              />
              <TextOverlay title={ss.title} startFrame={ss.frame} duration={ss.duration} />
            </div>
          </FadeTransition>
        </Sequence>
      ))}

      {/* Closing Call-to-Action */}
      <Sequence from={380} durationInFrames={70}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #000080 0%, #1e1e3f 100%)',
            position: 'relative',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              opacity: interpolate(frame - 380, [0, 15, 55, 70], [0, 1, 1, 0]),
            }}
          >
            <h2
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0 0 40px 0',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              Stay Connected
            </h2>
            <p
              style={{
                fontSize: 48,
                color: '#FF0000',
                margin: 0,
                fontFamily: 'Arial, sans-serif',
              }}
            >
              BBC.com/news
            </p>
          </div>
        </div>
      </Sequence>
    </div>
  );
};
