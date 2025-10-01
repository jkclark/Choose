import type React from "react";
import ChooseItem from "./ChooseItem";

const ChooseGame: React.FC<ChooseGameProps> = ({ numRows, numCols }) => {
  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="text-xl select-none">Choose one</div>
      <div
        className="grid w-full max-w-[800px] gap-4"
        style={{
          gridTemplateRows: `repeat(${numRows}, 1fr)`,
          gridTemplateColumns: `repeat(${numCols}, 1fr)`,
        }}
      >
        {Array.from({ length: numRows * numCols }).map((_, index) => (
          <ChooseItem key={index} index={index} />
        ))}
      </div>
    </div>
  );
};

interface ChooseGameProps {
  numRows: number;
  numCols: number;
}

export default ChooseGame;
