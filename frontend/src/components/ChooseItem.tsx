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
        "group relative flex aspect-[1/1.618] w-[80px] sm:w-[120px] md:w-[160px] lg:w-[200px] xl:w-[240px]",
        "items-center justify-center overflow-hidden rounded-md",
        "border-secondary/50 border-2 transition-colors select-none",
        !userChose ? "hover:border-secondary cursor-pointer" : "",
        chosenIndex === index ? "!border-secondary" : "",
      ].join(" ")}
      onClick={handleClick}
    >
      {/* Animated background */}
      <div
        className={[
          "bg-secondary absolute inset-x-0 bottom-0 transition-all duration-1000 ease-out",
          userChose ? "opacity-70" : "opacity-0",
        ].join(" ")}
        style={{
          height: userChose ? `${percentChosen}%` : "0%",
        }}
      />

      {/* Percentage text */}
      <span
        className={[
          "text-base-content relative z-10 text-2xl transition-opacity duration-350 ease-in-out",
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
