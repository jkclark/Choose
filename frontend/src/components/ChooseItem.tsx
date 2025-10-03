import type React from "react";

const ChooseItem: React.FC<ChooseItemProps> = ({
  index,
  userChose,
  chosenIndex,
  setChosenIndex,
  percentChosen,
}) => {
  function handleClick() {
    setChosenIndex(index);
  }

  return (
    <div
      className={[
        "group flex aspect-[1/2] w-full items-center justify-center rounded-md",
        "border border-black transition-colors select-none",
        !userChose ? "cursor-pointer hover:border-gray-100" : "",
        chosenIndex === index ? "border-gray-100" : "",
      ].join(" ")}
      onClick={handleClick}
    >
      {!userChose && (
        <span className="text-transparent transition-colors group-hover:text-white">
          Choose me
        </span>
      )}
      {userChose && (
        <span className="text-lg text-white">{percentChosen.toFixed(1)}%</span>
      )}
    </div>
  );
};

interface ChooseItemProps {
  index: number;
  userChose: boolean;
  chosenIndex: number;
  setChosenIndex: (index: number) => void;
  percentChosen: number;
}

export default ChooseItem;
