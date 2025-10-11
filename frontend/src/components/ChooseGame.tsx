import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { submitChoice } from "../backend";
import {
  getMostRecentTallyTime,
  getTotalChoices,
  type Choice,
} from "../choices";
import { Orientation, type Orientation as OrientationType } from "../games";
import { getChoiceLocally, saveChoiceLocally } from "../localStorage";
import ChooseItem from "./ChooseItem";

const ChooseGame: React.FC<ChooseGameProps> = ({
  gameId,
  numRows,
  numCols,
  choiceCounts,
  orientation,
  onChoiceMade,
}) => {
  const [chosenIndex, setChosenIndex] = useState<number>(-1);
  const [didLoadSavedChoice, setDidLoadSavedChoice] = useState(false);

  const userChose = chosenIndex !== -1;

  const isSideways = orientation === Orientation.SIDEWAYS;
  const isSquare = orientation === Orientation.SQUARE;

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
    if (isSquare) {
      // For square items, itemSize represents both width and height
      // Use the smaller of available width and height to ensure squares fit
      finalSize = Math.min(availableWidth, availableHeight);
    } else if (isSideways) {
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
  }, [numRows, numCols, isSideways, isSquare]);

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
    (index: number, isUserInitiated = true) => {
      if (!userChose) {
        setChosenIndex(index);
        addUserChoiceToChoiceCounts(index);

        // Only call the callback for user-initiated choices, not loaded choices
        if (isUserInitiated) {
          onChoiceMade?.();
        }
      }
    },
    [userChose, addUserChoiceToChoiceCounts, onChoiceMade],
  );

  // On mount, check for a saved choice
  useEffect(() => {
    const storedChoice = getChoiceLocally(gameId);
    if (storedChoice) {
      setDidLoadSavedChoice(true);
      // Small delay to ensure the component is fully mounted and CSS transitions work
      setTimeout(() => {
        // Check if the stored choice should be counted based on timing
        const mostRecentTallyTime = getMostRecentTallyTime();
        const shouldCountChoice = storedChoice.chosenTime > mostRecentTallyTime;

        setChosenIndex(storedChoice.choice);

        // Only add to choice counts if the choice should be counted
        if (shouldCountChoice) {
          addUserChoiceToChoiceCounts(storedChoice.choice);
        }
      }, 50);
    }
  }, [gameId, addUserChoiceToChoiceCounts]);

  // When the user makes a choice, save it locally and submit it to the backend
  useEffect(() => {
    if (userChose && !didLoadSavedChoice) {
      const choice: Choice = {
        gameId: gameId,
        choice: chosenIndex,
        chosenTime: new Date().toISOString(),
      };

      saveChoiceLocally(choice);

      // Submit to backend
      submitChoice(choice).catch((error) => {
        console.error(`Failed to submit choice for game ${gameId}:`, error);
      });
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

  return (
    <div className="flex h-[80dvh] w-full max-w-[800px] flex-col items-center p-4 select-none">
      {/* Top spacer */}
      <div className="flex-1"></div>

      {/* Centered grid container */}
      <div className="flex items-center justify-center">
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
              sideways={isSideways}
              square={isSquare}
              numCols={numCols}
            />
          ))}
        </div>
      </div>

      {/* Middle spacer with total choices centered */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className={[
            "text-xl transition-opacity duration-350 ease-in-out sm:text-2xl",
            userChose ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          Total choices:{" "}
          <span className="text-secondary">
            {totalChoices.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="flex-1"></div>
    </div>
  );
};

interface ChooseGameProps {
  gameId: number;
  numRows: number;
  numCols: number;
  choiceCounts: Record<number, number>;
  orientation: OrientationType;
  onChoiceMade?: () => void;
}

export default ChooseGame;
