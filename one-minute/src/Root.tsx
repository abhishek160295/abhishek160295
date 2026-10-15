import { MyComposition } from "./Composition";
import { StartingMondayComp } from "./sm/Film";
import { ThumbComp } from "./sm/Thumb";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <StartingMondayComp />
      <ThumbComp />
    </>
  );
};
