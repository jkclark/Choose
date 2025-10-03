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
        "group relative flex aspect-[1/2] w-full items-center justify-center overflow-hidden rounded-md",
        "border border-black transition-colors select-none",
        !userChose ? "cursor-pointer hover:border-gray-100" : "",
        chosenIndex === index ? "border-gray-100" : "",
      ].join(" ")}
      onClick={handleClick}
    >
      {/* Animated background */}
      <div
        className={[
          "absolute inset-x-0 bottom-0 bg-gray-600 transition-all duration-1000 ease-out",
          userChose ? "opacity-70" : "opacity-0",
        ].join(" ")}
        style={{
          height: userChose ? `${percentChosen}%` : "0%",
        }}
      />

      {/* Percentage text */}
      <span
        className={[
          "relative z-10 text-2xl text-white transition-opacity duration-350 ease-in-out",
          userChose ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {percentChosen.toFixed(1)}%
      </span>
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
