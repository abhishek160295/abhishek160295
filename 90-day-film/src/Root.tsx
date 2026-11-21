import React from 'react';
import {Composition, Still} from 'remotion';
import {Film} from './Film';
import {Thumbnail} from './scenes/Thumbnail';
import {FPS, TOTAL} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DataGuy90" component={Film} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Still id="Thumbnail" component={Thumbnail} width={1080} height={1920} />
  </>
);
