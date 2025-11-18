import { useState } from "react";

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectOptionCallback,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    selectOptionCallback(option);

    // Close the dropdown by removing focus
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  return (
    <div className="dropdown dropdown-start">
      <div tabIndex={0} role="button" className="btn text-xl font-normal">
        {selectedOption}
        <svg
          className="ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {options.map((option) => (
          <li key={option}>
            <a onClick={() => handleOptionClick(option)} className="text-sm">
              {option}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface DropdownProps {
  options: string[];
  selectOptionCallback: (option: string) => void;
}

export default Dropdown;
