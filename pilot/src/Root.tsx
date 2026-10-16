import { Composition } from 'remotion';
import { TestShot } from './TestShot';

export const Root: React.FC = () => (
  <Composition id="TestShot" component={TestShot} durationInFrames={375} fps={30} width={1920} height={1080} />
);
