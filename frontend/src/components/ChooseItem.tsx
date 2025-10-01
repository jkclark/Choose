import type React from "react";

const ChooseItem: React.FC<ChooseItemProps> = ({
  index,
  setChosenIndex,
  className,
}) => {
  function handleClick() {
    setChosenIndex(index);
  }

  return (
    <div
      className={`group flex aspect-[1/2] w-full cursor-pointer items-center justify-center rounded-md border border-black transition-colors select-none hover:border-gray-100 ${className}`}
      onClick={handleClick}
    >
      <span className="text-transparent transition-colors group-hover:text-white">
        Choose me
      </span>
    </div>
  );
};

interface ChooseItemProps {
  index: number;
  setChosenIndex: (index: number) => void;
  className?: string;
}

export default ChooseItem;
