import { useEffect, useState } from "react";

import { getAllChoices } from "./backend";
import { type AllChoiceCounts } from "./choices";
import ChooseGame from "./components/ChooseGame";
import { games } from "./games";

function App() {
  const [gameIndex, setGameIndex] = useState(0);

  const [allChoiceCounts, setAllChoiceCounts] = useState({} as AllChoiceCounts);

  // On mount, fetch all choices
  useEffect(() => {
    const fetchAllChoices = async () => {
      const choices = await getAllChoices();
      setAllChoiceCounts(choices);
    };
    fetchAllChoices();
  }, []);

  function getChoiceCountsForGameIndex(index: number) {
    return allChoiceCounts ? allChoiceCounts[index] || {} : {};
  }

  function goToNextGame() {
    // Go next, or do nothing if we're at the last game
    if (gameIndex < games.length - 1) {
      setGameIndex((prev) => prev + 1);
    }
  }

  function goToPrevGame() {
    // Go previous, or do nothing if we're at the first game
    if (gameIndex > 0) {
      setGameIndex((prev) => prev - 1);
    }
  }

  return (
    <div className="bg-base-100 text-base-content flex h-dvh w-full flex-col items-center justify-center">
      <ChooseGame
        key={gameIndex} // Force remount when gameIndex changes
        numRows={games[gameIndex].rows}
        numCols={games[gameIndex].cols}
        gameId={games[gameIndex].id}
        choiceCounts={getChoiceCountsForGameIndex(gameIndex)}
      />
      <div className="flex w-full max-w-[800px] justify-between gap-2 px-10 sm:gap-3 md:gap-4">
        <div className="btn w-20" onClick={goToPrevGame}>
          Previous
        </div>
        <div className="btn w-20" onClick={goToNextGame}>
          Next
        </div>
      </div>
    </div>
  );
}

export default App;
