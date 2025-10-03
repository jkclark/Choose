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

  const userChose = chosenIndex !== -1;

  const choicePercents = getPercentagesOfChoices(choiceCounts);

  useEffect(() => {
    if (userChose) {
      const choice: Choice = {
        gameId: gameId,
        choice: chosenIndex,
      };
      submitChoices([choice]);
    }
  }, [userChose, chosenIndex, gameId]);

  function setChosenIndexIfNotChosen(index: number) {
    if (!userChose) {
      setChosenIndex(index);
    }
  }

  function getPercentagesOfChoices(choices: Record<number, number>) {
    if (!choices) {
      return {};
    }

    const total = Object.values(choices).reduce((sum, count) => sum + count, 0);
    const percentages: Record<number, number> = {};

    for (const [choice, count] of Object.entries(choices)) {
      percentages[Number(choice)] = (count / total) * 100;
    }

    return percentages;
  }

  return (
    <div className="flex w-full max-w-[800px] flex-col items-center gap-4 p-4">
      <div className="text-xl select-none">Choose one</div>
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
            userChose={userChose}
            chosenIndex={chosenIndex}
            setChosenIndex={setChosenIndexIfNotChosen}
            percentChosen={choicePercents[index] || 0}
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
