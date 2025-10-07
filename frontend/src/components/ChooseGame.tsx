import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { submitChoice } from "../backend";
import { type Choice } from "../choices";
import { getChoiceLocally, saveChoiceLocally } from "../localStorage";
import ChooseItem from "./ChooseItem";

const ChooseGame: React.FC<ChooseGameProps> = ({
  gameId,
  numRows,
  numCols,
  choiceCounts,
  sideways,
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

  // Calculate dynamic item size based on available space and grid dimensions
  const calculateItemSize = useCallback(() => {
    // Base container width (accounting for padding and gaps)
    const maxContainerWidth = Math.min(window.innerWidth - 32, 800); // 2rem padding
    const maxContainerHeight = window.innerHeight * 0.8 * 0.7; // 80dvh * 70% for items

    // Account for gaps between items
    const gapSize = numCols >= 3 ? 6 : 8; // Responsive gap
    const totalGapWidth = (numCols - 1) * gapSize;
    const totalGapHeight = (numRows - 1) * gapSize;

    // Calculate available space per item
    const availableWidth = (maxContainerWidth - totalGapWidth) / numCols;
    const availableHeight = (maxContainerHeight - totalGapHeight) / numRows;

    // Use golden ratio (1:1.618) for aspect ratio
    const goldenRatio = 1.618;

    let finalSize;
    if (sideways) {
      // For sideways, itemSize will be the HEIGHT, and width = height * goldenRatio
      // Calculate size based on width constraint (itemSize * goldenRatio <= availableWidth)
      const heightBasedOnWidth = availableWidth / goldenRatio;

      // Calculate size based on height constraint (itemSize <= availableHeight)
      const heightBasedOnHeight = availableHeight;

      // Use the smaller to ensure both width and height fit
      finalSize = Math.min(heightBasedOnWidth, heightBasedOnHeight);
    } else {
      // For normal, itemSize will be the WIDTH, and height = width * goldenRatio
      // Calculate size based on width constraint (itemSize <= availableWidth)
      const widthBasedOnWidth = availableWidth;

      // Calculate size based on height constraint (itemSize * goldenRatio <= availableHeight)
      const widthBasedOnHeight = availableHeight / goldenRatio;

      // Use the smaller to ensure both width and height fit
      finalSize = Math.min(widthBasedOnWidth, widthBasedOnHeight);
    }

    // Set minimum and maximum bounds
    return Math.max(60, Math.min(240, finalSize));
  }, [numRows, numCols, sideways]);

  const [itemSize, setItemSize] = useState(() => calculateItemSize());

  // Recalculate size on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemSize(calculateItemSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateItemSize]);

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

      submitChoice(choice);
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
        className="grid justify-center"
        style={{
          gridTemplateRows: `repeat(${numRows}, 1fr)`,
          gridTemplateColumns: `repeat(${numCols}, auto)`,
          gap: `${numCols >= 3 ? 6 : 8}px`,
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
            itemSize={itemSize}
            sideways={sideways}
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
  sideways: boolean;
}

export default ChooseGame;
