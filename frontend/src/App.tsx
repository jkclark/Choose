import { useEffect, useState } from "react";

import { getAllChoices } from "./backend";
import { type AllChoiceCounts } from "./choices";
import ChooseGame from "./components/ChooseGame";

function App() {
  const [allChoiceCounts, setAllChoiceCounts] = useState({} as AllChoiceCounts);

  // On mount, fetch all choices
  useEffect(() => {
    const fetchAllChoices = async () => {
      const choices = await getAllChoices();
      setAllChoiceCounts(choices);
    };
    fetchAllChoices();
  }, []);

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <ChooseGame
        numRows={1}
        numCols={4}
        gameId={0}
        choiceCounts={allChoiceCounts[0]}
      />
    </div>
  );
}

export default App;
