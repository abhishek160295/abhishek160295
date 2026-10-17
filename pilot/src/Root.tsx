import { Composition } from 'remotion';
import { TestShot } from './TestShot';
import { cues, TAKES } from './timeline';
import { Episode } from './ep/Episode';
import { TOTAL_FRAMES } from './ep/timing';
import { Thumb } from './ep/Thumb';
import { ModelSheet } from './max/ModelSheet';
import { ColdOpen, COLD_OPEN_FRAMES } from './mem/ColdOpen';
import { MemEpisode, MEM_FRAMES } from './mem/Episode';
import { InvEpisode, INV_FRAMES } from './inv/Episode';
import { MindEpisode, MIND_FRAMES } from './mind/Episode';
import { FutureEpisode, FUTURE_FRAMES } from './future/Episode';
import { BrainLookComp } from './brain/look';
import { BrainS1, S1_FRAMES } from './brain/Episode';

export const Root: React.FC = () => (
  <>
    <Composition id="BrainS1" component={BrainS1} durationInFrames={S1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="BrainLook" component={BrainLookComp} durationInFrames={4} fps={30} width={1920} height={1080} />
    <Composition id="FutureEpisode" component={FutureEpisode} durationInFrames={FUTURE_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="MindEpisode" component={MindEpisode} durationInFrames={MIND_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="InvEpisode" component={InvEpisode} durationInFrames={INV_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="MemEpisode" component={MemEpisode} durationInFrames={MEM_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="MemColdOpen" component={ColdOpen} durationInFrames={COLD_OPEN_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="MaxSheet" component={ModelSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
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
