import Dropdown from "./Dropdown";

const Navbar: React.FC<NavbarProps> = ({ options, selectOptionCallback }) => {
  return (
    <nav className="navbar bg-base-200 px-4">
      <div className="navbar-start flex-1">
        <div className="px-3 text-xl">Effect:</div>
        <Dropdown
          options={options}
          selectOptionCallback={selectOptionCallback}
        />
      </div>
    </nav>
  );
};

interface NavbarProps {
  options: string[];
  selectOptionCallback: (option: string) => void;
}

export default Navbar;
