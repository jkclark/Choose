import ChooseGame from "./components/ChooseGame";

function App() {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <ChooseGame numRows={1} numCols={4} />
    </div>
  );
}

export default App;
