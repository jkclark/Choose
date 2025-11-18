import { useState } from "react";

import Navbar from "./components/Navbar";
import ChooseExperiment from "./experiments/choose/ChooseExperiment";
import FAEExperiment from "./experiments/fae/FAEExperiment";
import "./index.css";

function App() {
  const experiments = [
    {
      name: "Choose",
      component: <ChooseExperiment />,
    },
    {
      name: "FAE",
      component: <FAEExperiment />,
    },
  ];

  const [currentExperiment, setCurrentExperiment] = useState<{
    name: string;
    component: React.ReactNode;
  } | null>(experiments[0]);

  return (
    <div className="bg-base-100 text-base-content flex h-dvh w-full flex-col items-center justify-start pb-6">
      <Navbar
        options={experiments.map((exp) => exp.name)}
        selectOptionCallback={(option) => {
          const selectedExperiment = experiments.find(
            (exp) => exp.name === option,
          );
          if (selectedExperiment) {
            setCurrentExperiment(selectedExperiment);
          }
        }}
      />
      <div
        className="w-full max-w-[800px] flex-1"
        style={{ height: "calc(100% - 64px)" }}
      >
        {currentExperiment ? currentExperiment.component : null}
      </div>
    </div>
  );
}

export default App;
