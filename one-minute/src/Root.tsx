import { MyComposition } from "./Composition";
import { StartingMondayComp } from "./sm/Film";
import { ThumbComp } from "./sm/Thumb";
import { ReelComp } from "./sm/Reel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <StartingMondayComp />
      <ThumbComp />
      <ReelComp />
    </>
  );
};
