import { Composition } from 'remotion';
import { TestShot } from './TestShot';
import { cues, TAKES } from './timeline';
import { Episode } from './ep/Episode';
import { TOTAL_FRAMES } from './ep/timing';

export const Root: React.FC = () => (
  <>
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
