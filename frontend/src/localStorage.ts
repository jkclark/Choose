import type { Choice } from "./choices";

const CHOICES_KEY = "choices";

export function saveChoiceLocally(choice: Choice): void {
  const choices = getChoicesFromLocalStorage();

  if (choices[choice.gameId] !== undefined) {
    // Choice already exists, do not overwrite, log an error
    console.error("Choice already exists for game ID", choice.gameId);
    return;
  }

  choices[choice.gameId] = choice.choice;

  localStorage.setItem(CHOICES_KEY, JSON.stringify(choices));
}

export function getChoiceLocally(gameId: number): Choice | null {
  const choices = getChoicesFromLocalStorage();
  const choice = choices[gameId];
  return choice !== undefined ? { gameId, choice } : null;
}

function getChoicesFromLocalStorage(): Record<number, number> {
  const choicesString = localStorage.getItem(CHOICES_KEY);
  if (!choicesString) {
    return {};
  }

  try {
    const choices = JSON.parse(choicesString);
    return choices;
  } catch (e) {
    console.error("Error parsing choices from localStorage", e);
    return {};
  }
}
