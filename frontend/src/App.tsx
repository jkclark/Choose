import { useEffect, useRef, useState } from "react";

import { getAllChoices } from "./backend";
import { getTotalChoices, type AllChoiceCounts } from "./choices";
import AboutModal from "./components/AboutModal";
import ChooseGame from "./components/ChooseGame";
import ThankYouModal, {
  type ThankYouModalRef,
} from "./components/ThankYouModal";
import { games } from "./games";
import {
  getChoicesFromLocalStorage,
  getNonTalliedUserChoices,
} from "./localStorage";

import ReadyNotification from "./components/ReadyNotification";
import "./index.css";

function App() {
  const [gameIndex, setGameIndex] = useState(0);
  const [choiceCountsPerGame, setChoiceCountsPerGame] = useState(
    {} as AllChoiceCounts,
  );
  const thankYouModalRef = useRef<ThankYouModalRef>(null);

  // State to manage fade-in/fade-out animation
  const [isTransitioning, setIsTransitioning] = useState(false);

  // State to manage ready notification visibility
  const [showReadyNotification, setShowReadyNotification] = useState(false);

  const isLastGame = gameIndex === games.length - 1;

  // Callback to handle when user makes a choice
  const handleChoiceMade = () => {
    // Hide ready notification once user makes any choice
    setShowReadyNotification(false);

    if (isLastGame) {
      // Show thank you modal after a 2-second delay
      setTimeout(() => {
        thankYouModalRef.current?.openModal();
      }, 1500);
    }
  };

  // On mount, fetch all choices
  useEffect(() => {
    const fetchAllChoices = async () => {
      const choices = await getAllChoices();
      setChoiceCountsPerGame(choices);
    };
    fetchAllChoices();
  }, []);

  // Handle ready notification timing - show after 5 seconds if no choices made at all
  useEffect(() => {
    // Check if user has made ANY choice across all games
    const userChoices = getChoicesFromLocalStorage();
    const hasAnyChoice = Object.keys(userChoices).length > 0;

    // Only show notification if no choices exist at all
    if (!hasAnyChoice) {
      const timer = setTimeout(() => {
        setShowReadyNotification(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array - only run once on mount

  function getChoiceCountsForGameIndex(index: number) {
    return choiceCountsPerGame ? choiceCountsPerGame[index] || {} : {};
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

  function getTotalChoicesForAllGames() {
    // Get total from backend (all previous users' choices)
    const backendTotal = Object.keys(choiceCountsPerGame).reduce(
      (total, gameId) => {
        const counts = choiceCountsPerGame[Number(gameId)];
        return total + (counts ? getTotalChoices(counts) : 0);
      },
      0,
    );

    // Get current user's choices from localStorage
    const userChoices = getNonTalliedUserChoices();
    const userChoiceCount = Object.keys(userChoices).length;

    // Return combined total - the backend total includes all previously submitted choices,
    // and we add the current user's new choices that haven't been processed yet
    return backendTotal + userChoiceCount;
  }

  return (
    <div className="bg-base-100 text-base-content flex h-dvh w-full flex-col items-center justify-center pb-6">
      <div className="pt-8 text-3xl">
        <span>Choose one</span>
      </div>

      <div
        className={`transition-opacity duration-300 ${showReadyNotification ? "opacity-100" : "opacity-0"}`}
      >
        <ReadyNotification />
      </div>

      <div
        className={`flex w-full items-center justify-center transition-opacity duration-300 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <ChooseGame
          key={gameIndex} // Force remount when gameIndex changes
          numRows={games[gameIndex].rows}
          numCols={games[gameIndex].cols}
          gameId={games[gameIndex].id}
          choiceCounts={getChoiceCountsForGameIndex(gameIndex)}
          orientation={games[gameIndex].orientation}
          onChoiceMade={handleChoiceMade}
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

      <AboutModal />
      <ThankYouModal
        ref={thankYouModalRef}
        getTotalChoices={getTotalChoicesForAllGames}
      />
    </div>
  );
}

export default App;
