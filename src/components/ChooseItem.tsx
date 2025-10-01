import type React from "react";

const ChooseItem: React.FC<ChooseItemProps> = ({ index }) => {
  function handleClick() {
    alert(`You chose item ${index + 1}`);
  }

  return (
    <div
      className="group flex aspect-[1/2] w-full cursor-pointer items-center justify-center rounded-md border border-black transition-colors hover:bg-gray-100"
      onClick={handleClick}
    >
      <span className="text-transparent transition-colors group-hover:text-black">
        Choose me
      </span>
    </div>
  );
};

interface ChooseItemProps {
  index: number;
}

export default ChooseItem;
