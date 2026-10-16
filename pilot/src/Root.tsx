import { Composition } from 'remotion';
import { TestShot } from './TestShot';
import { cues, TAKES } from './timeline';

export const Root: React.FC = () => (
  <>
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
