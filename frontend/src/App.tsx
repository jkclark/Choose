import { useEffect, useState } from "react";

import { getAllChoices } from "./backend";
import { type AllChoiceCounts } from "./choices";
import ChooseGame from "./components/ChooseGame";
import { games } from "./games";

function App() {
  const [gameIndex, setGameIndex] = useState(0);
  const [allChoiceCounts, setAllChoiceCounts] = useState({} as AllChoiceCounts);

  // State to manage fade-in/fade-out animation
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    if (gameIndex < games.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setGameIndex((prev) => prev + 1);
        setTimeout(() => setIsTransitioning(false), 50); // Small delay for fade in
      }, 250); // 1/4 second fade out
    }
  }

  function goToPrevGame() {
    // Go previous, or do nothing if we're at the first game
    if (gameIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setGameIndex((prev) => prev - 1);
        setTimeout(() => setIsTransitioning(false), 50); // Small delay for fade in
      }, 250); // 1/4 second fade out
    }
  }

  return (
    <div className="bg-base-100 text-base-content flex h-dvh w-full flex-col items-center justify-center">
      <div
        className={`transition-opacity duration-300 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <ChooseGame
          key={gameIndex} // Force remount when gameIndex changes
          numRows={games[gameIndex].rows}
          numCols={games[gameIndex].cols}
          gameId={games[gameIndex].id}
          choiceCounts={getChoiceCountsForGameIndex(gameIndex)}
        />
      </div>
      <div className="flex w-full max-w-[800px] justify-between gap-2 px-10 sm:gap-3 md:gap-4">
        <button
          className="btn w-20"
          onClick={goToPrevGame}
          disabled={gameIndex === 0}
        >
          Previous
        </button>
        <button
          className="btn w-20"
          onClick={goToNextGame}
          disabled={gameIndex === games.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
