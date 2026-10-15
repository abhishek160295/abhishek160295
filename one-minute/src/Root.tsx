import { MyComposition } from "./Composition";
import { StartingMondayComp } from "./sm/Film";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <StartingMondayComp />
    </>
  );
};
