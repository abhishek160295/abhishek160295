import { Composition } from 'remotion';
import { TestShot } from './TestShot';
import { cues, TAKES } from './timeline';
import { Episode } from './ep/Episode';
import { TOTAL_FRAMES } from './ep/timing';
import { Thumb } from './ep/Thumb';

export const Root: React.FC = () => (
  <>
    <Composition id="Thumb50x" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="Episode50x" component={Episode} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
    {(Object.keys(TAKES) as (keyof typeof TAKES)[]).map((voice) => (
      <Composition
        key={voice}
        id={`Demo-${voice}`}
        component={TestShot}
        defaultProps={{ voice }}
        durationInFrames={cues(TAKES[voice]).total}
        fps={30}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
