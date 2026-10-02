import { Composition } from 'remotion';
import { PromoVideo } from './PromoVideo';

const fps = 30;
const durationInSeconds = 15;

export const RemotionRoot = () => {
  return (
    <Composition
      id="BBC-Northern-News-Promo"
      component={PromoVideo}
      durationInFrames={durationInSeconds * fps}
      fps={fps}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
