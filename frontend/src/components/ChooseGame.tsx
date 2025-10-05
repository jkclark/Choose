import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { submitChoices } from "../backend";
import { type Choice } from "../choices";
import { getChoiceLocally, saveChoiceLocally } from "../localStorage";
import ChooseItem from "./ChooseItem";

const ChooseGame: React.FC<ChooseGameProps> = ({
  gameId,
  numRows,
  numCols,
  choiceCounts,
}) => {
  const [chosenIndex, setChosenIndex] = useState<number>(-1);
  const [didLoadSavedChoice, setDidLoadSavedChoice] = useState(false);

  const userChose = chosenIndex !== -1;

  // State to hold the original counts plus the user's choice
  const [choiceCountsPlusUserChoice, setChoiceCountsPlusUserChoice] = useState<
    Record<number, number>
  >({});
  const mergedCounts = { ...choiceCounts, ...choiceCountsPlusUserChoice };

  const totalChoices = getTotalChoices(mergedCounts);
  const choicePercents = getPercentagesOfChoices(mergedCounts);

  const addUserChoiceToChoiceCounts = useCallback(
    (index: number) => {
      setChoiceCountsPlusUserChoice((prevCounts) => {
        return {
          ...prevCounts,
          [index]: (choiceCounts[index] || 0) + 1,
        };
      });
    },
    [choiceCounts],
  );

  const setChosenIndexIfNotChosen = useCallback(
    (index: number) => {
      if (!userChose) {
        setChosenIndex(index);

        addUserChoiceToChoiceCounts(index);
      }
    },
    [userChose, addUserChoiceToChoiceCounts],
  );

  // On mount, check for a saved choice
  useEffect(() => {
    const storedChoice = getChoiceLocally(gameId);
    if (storedChoice) {
      setDidLoadSavedChoice(true);
      setChosenIndexIfNotChosen(storedChoice.choice);
    }
  }, [gameId, setChosenIndexIfNotChosen]);

  // When the user makes a choice, save it locally and submit it to the backend
  useEffect(() => {
    if (userChose && !didLoadSavedChoice) {
      const choice: Choice = {
        gameId: gameId,
        choice: chosenIndex,
      };

      saveChoiceLocally(choice);

      submitChoices([choice]);
    }
  }, [userChose, chosenIndex, gameId, didLoadSavedChoice]);

  function getPercentagesOfChoices(choices: Record<number, number>) {
    if (!choices) {
      return {};
    }

    const total = getTotalChoices(choices);
    const percentages: Record<number, number> = {};

    for (const [choice, count] of Object.entries(choices)) {
      percentages[Number(choice)] = (count / total) * 100;
    }

    return percentages;
  }

  function getTotalChoices(choices: Record<number, number>) {
    if (!choices) {
      return 0;
    }

    return Object.values(choices).reduce((sum, count) => sum + count, 0);
  }

  return (
    <div className="flex h-[80dvh] w-full max-w-[800px] flex-col items-center justify-center gap-4 p-4 select-none">
      <div className="text-xl">Choose one</div>
      <div
        className="grid justify-center gap-2 sm:gap-3 md:gap-4"
        style={{
          gridTemplateRows: `repeat(${numRows}, 1fr)`,
          gridTemplateColumns: `repeat(${numCols}, auto)`,
          maxWidth: "min(100vw - 2rem, 800px)",
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
      <div
        className={[
          "text-lg transition-opacity duration-350 ease-in-out",
          userChose ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        Total choices: <span className="text-secondary">{totalChoices}</span>
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
