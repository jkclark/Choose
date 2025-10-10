import type React from "react";

const ChooseItem: React.FC<ChooseItemProps> = ({
  index,
  userChose,
  chosenIndex,
  setChosenIndex,
  percentChosen,
  itemSize,
  sideways,
  square,
  numCols,
}) => {
  function handleClick() {
    setChosenIndex(index);
  }

  // Calculate text size based on number of columns with responsive breakpoints
  const getTextSizeClass = () => {
    if (numCols === 1 || numCols === 2)
      return "text-2xl sm:text-3xl lg:text-4xl";
    if (numCols === 3 || numCols === 4) return "text-lg sm:text-xl lg:text-3xl";
    return "text-sm sm:text-base lg:text-xl"; // 5+ columns
  };

  return (
    <div
      className={[
        "group relative flex items-center justify-center overflow-hidden rounded-md",
        "border-secondary/50 border-2 transition-colors select-none",
        !userChose ? "hover:border-secondary cursor-pointer" : "",
        chosenIndex === index ? "!border-secondary" : "",
      ].join(" ")}
      style={{
        width: square
          ? `${itemSize}px`
          : sideways
            ? `${itemSize * 1.618}px`
            : `${itemSize}px`,
        height: square
          ? `${itemSize}px`
          : sideways
            ? `${itemSize}px`
            : `${itemSize * 1.618}px`,
      }}
      onClick={handleClick}
    >
      {/* Animated background */}
      <div
        className={[
          "bg-secondary absolute transition-all duration-1000 ease-out",
          sideways && !square ? "inset-y-0 left-0" : "inset-x-0 bottom-0",
          userChose ? "opacity-70" : "opacity-0",
        ].join(" ")}
        style={{
          [sideways && !square ? "width" : "height"]: userChose
            ? `${percentChosen}%`
            : "0%",
        }}
      />

      {/* Percentage text */}
      <span
        className={[
          "text-base-content relative z-10 transition-opacity duration-350 ease-in-out",
          getTextSizeClass(),
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
  setChosenIndex: (index: number, isUserInitiated?: boolean) => void;
  percentChosen: number;
  itemSize: number;
  sideways: boolean;
  square: boolean;
  numCols: number;
}

export default ChooseItem;
