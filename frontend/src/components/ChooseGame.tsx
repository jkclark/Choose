import type React from "react";
import { useEffect, useState } from "react";

import { submitChoices, type Choice } from "../choices";
import ChooseItem from "./ChooseItem";

const ChooseGame: React.FC<ChooseGameProps> = ({
  gameId,
  numRows,
  numCols,
  choiceCounts,
}) => {
  const [chosenIndex, setChosenIndex] = useState<number>(-1);

  useEffect(() => {
    if (chosenIndex !== -1) {
      const choice: Choice = {
        gameId: gameId,
        choice: chosenIndex,
      };
      submitChoices([choice]);
    }
  }, [chosenIndex, gameId]);

  function setChosenIndexIfNotChosen(index: number) {
    if (chosenIndex === -1) {
      setChosenIndex(index);
    }
  }

  return (
    <div className="flex w-full max-w-[800px] flex-col items-center gap-4 p-4">
      <div className="text-xl select-none">Choose one</div>
      {chosenIndex !== -1 &&
        Object.entries(choiceCounts).map(([index, count]) => (
          <div key={index} className="flex w-full justify-around">
            <div>Choice {index}</div>
            <div>{count}</div>
          </div>
        ))}
      <div
        className="grid w-full max-w-[800px] gap-4"
        style={{
          gridTemplateRows: `repeat(${numRows}, 1fr)`,
          gridTemplateColumns: `repeat(${numCols}, 1fr)`,
        }}
      >
        {Array.from({ length: numRows * numCols }).map((_, index) => (
          <ChooseItem
            key={index}
            index={index}
            setChosenIndex={setChosenIndexIfNotChosen}
            className={
              chosenIndex >= 0
                ? index === chosenIndex
                  ? "bg-green-400"
                  : "bg-red-400"
                : ""
            }
          />
        ))}
      </div>
    </div>
  );
};

interface ChooseGameProps {
  gameId: number;
  numRows: number;
  numCols: number;
  choiceCounts: Record<number, number>;
}

export default ChooseGame;
